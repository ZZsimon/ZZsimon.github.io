import Taro, { getCurrentInstance } from '@tarojs/taro';
import React, { Component } from 'react';
import { deCodeStr } from '@/utils/deCodeStr';
import { View, Text, Image } from '@tarojs/components';
import PageContext from '@/components/pageContext';
import { isWeixinCient } from '@/utils/isWeixinCient';
import { getWxConfig } from '@/utils/getWxConfig';
import { request } from '@/request';
import OrderDetailComponent from './component-order-detail';
import Protocol from './component-protocol';
import AfterProtocol from './component-after-protocol';

import styles from './index.module.scss';
import tplStyles from './tpl.module.scss';

class Pay extends Component {
  state = {
    ProtocolModal: false,
    currentPay: 2,
    currentHuaBei: 3,
    payList: [],

    courseDetailStore: {},
    id: getCurrentInstance().router.params.lessonId,
    code: getCurrentInstance().router.params.code,
    channel: deCodeStr(getCurrentInstance().router.params.channel || ''),
    topicId: deCodeStr(getCurrentInstance().router.params.topicId || ''),
    isWx: isWeixinCient(),

    afterSalePolicymodal: false
  };

  componentDidMount() {
    const { canDrag, isTpl } = this.props;
    if (!isTpl && !canDrag) {
      this.getCourseDetail();
      this.handleWx();
    }
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  handleWx = () => {
    if (process.env.NODE_ENV === 'development') {
      return;
    }
    const { isWx } = this.state;
    if (isWx) {
      import('weixin-js-sdk').then((wx) => {
        this.getWxCode();
        getWxConfig({
          wx
        });
      });
    }
  };

  getWxCode = async () => {
    const openid = Taro.getStorageSync('pay-openid');
    if (openid) {
      return;
    }
    const { code } = this.state;

    if (code) {
      const res = await request('/xinmai-order/code-transition-openid', { code });
      if (res.success) {
        Taro.setStorageSync('pay-openid', res.data.openid);
      } else {
        this.goWx();
      }
    } else {
      this.goWx();
    }
  };

  goWx = () => {
    const { code, isWx } = this.state;
    let url = window.location.href;
    if (isWx && code) {
      url = window.location.href.split('?')[0];
    }

    const appId = 'wx1db477e0e9a3e4fa';
    const redirectUri = encodeURIComponent(url);
    const target = `https://wxauth.xinmai100.com/getWxCode.html?appid=${appId}&scope=snsapi_base&redirect_uri=${redirectUri}`;
    window.location.href = target;
  };

  getCourseDetail = async () => {
    const { id } = this.state;
    const res = await request('/xinmai-order/course-detail', { id });
    if (!res.success || res.subCode) {
      Taro.showToast({
        title: res.msg,
        icon: 'none',
        duration: 1000
      });
      return;
    }

    this.setState({
      courseDetailStore: {
        detail: res.data
      }
    });

    this.timer = setInterval(() => {
      this._getProductOrderStatus();
    }, 1000);
  };

  _getProductOrderStatus = async () => {
    const frontToken = Taro.getStorageSync('front-token');
    if (!frontToken) {
      return;
    }
    const { id } = this.state;
    const res = await request('/xinmai-order/query-product-order-status', { id });
    if (!res.success || res.subCode) {
      res.msg &&
        Taro.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1000
        });
      return;
    }

    if (res.data.status === 3) {
      clearInterval(this.timer);
      this.timer = null;
      this.goPaySuccess(res.data.orderId);
    }
  };

  goOrder = async () => {
    const { detail } = this.state.courseDetailStore;
    if (this.state.payList.length === 0 && detail.productPrice !== 0) {
      Taro.showToast({
        title: '请使用默认浏览器打开~',
        icon: 'none',
        duration: 1000,
        mask: true
      });
      return;
    }
    const { id } = this.state;
    const res = await request('/xinmai-order/query-product-order-status', { id });
    this.setState({
      submitLoading: false
    });
    if (detail.isConfirmProtocol === 0) {
      this.submitOrder(res);
    } else {
      if (res.data.status === 1) {
        this.showProtocolModal();
      } else {
        this.submitOrder(res);
      }
    }
  };

  submitOrder = async (res) => {
    const { id } = this.state;
    if (!res) {
      res = await request('/xinmai-order/query-product-order-status', { id });
    }

    const reqId = res.data.orderId;
    if (res.data.status === 1) {
      this._createOrder(id);
    } else if (res.data.status === 2) {
      const { detail } = this.state.courseDetailStore;
      this._unifiedPay({
        id: reqId,
        payAmount: detail.productPrice
      });
    } else {
      this.goPaySuccess(reqId);
    }
  };

  _createOrder = async (id) => {
    const { detail } = this.state.courseDetailStore;
    const openid = Taro.getStorageSync('openid');
    const { channel, topicId } = this.state;
    const data = {
      productId: id,
      ...getCurrentInstance().router.params,
      protocolId: detail.protocolId,
      payAmount: detail.productPrice,
      marketChannelId: channel,
      topicId: topicId,
      openid,
      url: window.location.href
    };
    const res = await request('/xinmai-order/create-order', data);
    if (!res.success) {
      Taro.showToast({
        title: res.msg,
        icon: 'none',
        duration: 1000
      });

      return;
    }
    if (res.data.payAmount === 0) {
      this.goPaySuccess(res.data.id);
      return;
    }
    if (res.data.status === 1) {
      this._unifiedPay({
        id: res.data.id,
        payAmount: res.data.payAmount
      });
    }
  };

  _unifiedPay = async (params) => {
    const { currentPay, currentHuaBei, isWx } = this.state;

    const payTypeMap = {
      1: isWx ? 103 : 102,
      2: 202,
      3: 302,
      6: 601
    };
    const payType = payTypeMap[currentPay];

    const container = document.querySelector('#alipay');
    if (container) {
      document.body.removeChild(container);
    }
    Taro.showLoading({
      title: '支付中'
    });
    const openid = Taro.getStorageSync('pay-openid');
    try {
      const res = await request('/xinmai-order/unified-pay', {
        ...getCurrentInstance().router.params,
        ...params,
        payType,
        fqNum: payType === 302 ? currentHuaBei : null,
        openid: openid,
        returnUrl: window.location.href
      });

      if (payType === 202) {
        this.aliPay(res.data.body);
      } else if (payType === 102) {
        const url = encodeURIComponent(window.location.href);
        window.location.href = `${res.data.mwebUrl}&redirect_url=${url}`;
      } else if (payType === 103) {
        this.wxPay(res.data, params.id);
      } else if (payType === 302) {
        this.aliPay(res.data.body);
      } else if (payType === 601) {
        window.location.href = `${res.data.qrCode}`;
      }
    } catch (error) {
      Taro.hideLoading();
    }
    Taro.hideLoading();
  };

  wxPay = async (data, id) => {
    window.WeixinJSBridge.invoke(
      'getBrandWCPayRequest',
      {
        appId: data.appId, // 公众号名称，由商户传入
        timeStamp: data.timeStamp, // 时间戳，自1970年以来的秒数
        nonceStr: data.nonceStr, // 随机串
        package: data.packageValue,
        signType: data.signType, // 微信签名方式：
        paySign: data.paySign // 微信签名
      },
      (res) => {
        if (res.err_msg === 'get_brand_wcpay_request:ok') {
          this.goPaySuccess(id);
        } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
          Taro.showToast({
            title: '已取消支付',
            icon: 'none',
            duration: 1000
          });
        } else if (res.err_msg === 'get_brand_wcpay_request:fail') {
          Taro.showToast({
            title: '支付失败',
            icon: 'none',
            duration: 1000
          });
        }
      }
    );
  };

  aliPay(data) {
    const form = data;
    const div = document.createElement('div');
    div.id = 'alipay';
    div.innerHTML = form;
    document.body.appendChild(div);
    document.querySelector('#alipay').children[0].submit(); // 执行后会唤起支付宝
  }

  CloseProtocolModal = () => {
    this.setState({
      ProtocolModal: false
    });
  };

  showProtocolModal = () => {
    this.setState({
      ProtocolModal: true
    });
  };

  initPay = (payList) => {
    this.setState({
      currentPay: payList[0],
      payList
    });
  };

  goPaySuccess = () => {
    this.authUserQrCode();
  };

  authUserQrCode = async () => {
    const { channel } = this.state;
    const mobile = Taro.getStorageSync('front-mobile');
    const res = await request('/xinmai-order/auth-user-qr-code', {
      mobile,
      marketChannelId: channel
    });

    if (!res.success) {
      Taro.showToast({
        title: res.msg,
        icon: 'none',
        duration: 1000
      });
      return;
    }

    const { url, weixin } = res.data;

    this.goQrCode({
      url,
      weixin
    });
  };

  goQrCode = ({ url, weixin }) => {
    const { router } = getCurrentInstance();
    const replaceStr = `pageId=3`;
    const _path = router.path.replace(/pageId=2/, replaceStr);
    const path = _path.replace(
      /&pageId=3/,
      `&pageId=3&url=${encodeURIComponent(url)}&wxName=${weixin}`
    );
    Taro.redirectTo({
      url: path
    });
  };

  closeAfterSalePolicymodal = () => {
    this.setState({
      afterSalePolicymodal: false
    });
  };

  showAfterSalePolicymodal = () => {
    this.setState({
      afterSalePolicymodal: true
    });
  };

  render() {
    const { isTpl, title, canDrag } = this.props;
    const { afterSalePolicymodal, courseDetailStore, id, submitLoading } = this.state;
    const { detail } = courseDetailStore;

    // 左侧组件模版
    if (isTpl) {
      return (
        <View className={tplStyles.imgTpl}>
          <Image
            className={tplStyles.image}
            src='https://resource.xinmai100.com/authUser/2021032518444690562629.png'
          />
          <View className={tplStyles.title}>{title}</View>
        </View>
      );
    }
    // 中间支付组件预览
    if (!isTpl && canDrag) {
      return (
        <View className={`${styles.imageWrapper} ${canDrag ? styles.eventsNone : ''}`}>
          <Image
            className={styles.image}
            src='https://resource.xinmai100.com/authUser/2021040913293552995671.png'
          ></Image>
        </View>
      );
    }

    return detail ? (
      <PageContext.Provider
        value={{
          courseDetailStore
        }}
      >
        <View
          style={{
            height: canDrag ? 'auto' : '100vh',
            paddingBottom: canDrag ? '320px' : '0'
          }}
          className={styles['preview-wrapper']}
        >
          <OrderDetailComponent
            showProtoco={this.showAfterSalePolicymodal}
            courseDetail={detail}
            id={id}
            getTopHistory={() => {
              return this.props.history;
            }}
            history={this.props.history}
            getPayWay={(currentPay) => this.setState({ currentPay })}
            initPay={(payList) => this.initPay(payList)}
            getHuaBeiCount={(currentHuaBei) => this.setState({ currentHuaBei })}
          />

          <View className={styles['detail-buttom']}>
            <View className={styles['price-box']}>
              <Text className={styles.left}>合计: </Text>
              <Text className={styles['new-price']}>
                {detail.productPrice === 0 ? '免费' : `¥${detail.productPrice.toFixed(2)}`}
              </Text>
            </View>
            <View className={styles['go-order']} onClick={this.goOrder}>
              {submitLoading ? '确认中...' : '确认并支付'}
            </View>
          </View>

          {this.state.ProtocolModal && detail && detail.protocolId ? (
            <Protocol
              id={detail.protocolId}
              CloseProtocolModal={this.CloseProtocolModal}
              ProtocolModal={this.state.ProtocolModal}
              submitOrder={this.submitOrder}
            />
          ) : null}

          {afterSalePolicymodal ? (
            <AfterProtocol
              id={3}
              CloseProtocolModal={this.closeAfterSalePolicymodal}
              ProtocolModal={afterSalePolicymodal}
            />
          ) : null}
        </View>
      </PageContext.Provider>
    ) : null;
  }
}

export default Pay;
