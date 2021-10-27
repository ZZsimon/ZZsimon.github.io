import React, { Component } from 'react';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Input } from '@tarojs/components';
import { request } from '@/request';
import { getElementSize } from '@/utils/getElementSize';
import { fixInputBugs } from '@/utils/fixInputBugs';
import { deCodeStr } from '@/utils/deCodeStr';
import CodeModal from './codeModal';
import ImgCodeModal from './imgCodeModal';

import styles from './index.module.scss';

class InputContent extends Component {
  imgData = {};
  state = {
    visible: false,
    visibleImg: false,
    base64Img: '',
    channel: deCodeStr(getCurrentInstance().router.params.channel || ''),
    marketActivityId: getCurrentInstance().router.params.marketActivityId || '',
    spokesperson: getCurrentInstance().router.params.spokesperson || '',
    inputValue: ''
  };

  componentDidMount() {
    fixInputBugs();
  }

  handleChange = (e) => {
    const inputValue = e.target.value;
    this.setState({
      inputValue
    });
  };

  handleSubmit = () => {
    const { inputValue } = this.state;
    const telReg = new RegExp(/^1[3|4|5|6|7|8|9][0-9]\d{8}$/);
    if (!inputValue) {
      Taro.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 1000,
        mask: true
      });
      return;
    }
    if (!telReg.test(inputValue)) {
      Taro.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1000,
        mask: true
      });
      return;
    }
    this.mobile = inputValue;
    this.showSendSmsAuthCode();
  };

  showSendSmsAuthCode = async () => {
    const { smsCode } = this.props;
    Taro.showLoading({
      title: '提交中...'
    });

    try {
      const res = await request('/xinmai-order/show-submit-leads-auth-code', {
        mobile: smsCode === 2 ? '' : this.mobile
      });
      Taro.hideLoading();
      if (res.data.showAuthCode === 1) {
        this.getCaptcha();
      } else {
        this.submit();
      }
    } catch (error) {
      Taro.hideLoading();
    }
  };

  getCaptcha = async () => {
    const res = await request('/xinmai-order/captcha', {});

    if (res.success) {
      this.setState({
        base64Img: `data:image/png;base64,${res.data.base64}`
      });
      this.updateImgData({
        imgCaptchaUuid: res.data.uuid
      });
    }

    const { visibleImg, visible } = this.state;
    if (!visibleImg) {
      this.toogleImgModal(true);
    }
    if (visible) {
      this.toogleCodeModal(false);
    }
  };

  updateImgData = (data) => {
    const imgData = { ...this.imgData };
    this.imgData = {
      ...imgData,
      ...data
    };
  };

  submit = () => {
    const { smsCode } = this.props;
    if (smsCode === 2) {
      this.submitMarketLeads();
      this.updateImgData({
        imgCaptcha: ''
      });
      return;
    }
    this.dayuwenSendSms();
  };

  submitMarketLeads = async (data) => {
    const { channel, marketActivityId, spokesperson } = this.state;
    const openid = Taro.getStorageSync('openid');
    const appid = Taro.getStorageSync('appid');
    const res = await request('/xinmai-order/submit-market-leads', {
      ...getCurrentInstance().router.params,
      marketChannelId: channel,
      spokesperson: spokesperson,
      marketActivityId: marketActivityId,
      mobile: this.mobile,
      captchaVerificationCode: this.imgData.imgCaptcha,
      captchaUuid: this.imgData.imgCaptchaUuid,
      openid,
      appid,
      url: window.location.href,
      ...data
    });

    if (!res.success) {
      Taro.showToast({
        title: res.msg,
        icon: 'none',
        duration: 1000
      });
      if (res.code === 100004) {
        this.getCaptcha();
      }
      return;
    }
    this.toogleCodeModal(false);
    this.toogleImgModal(false);
    this.authUserQrCode();
  };

  authUserQrCode = async () => {
    const { channel } = this.state;
    const res = await request('/xinmai-order/auth-user-qr-code', {
      mobile: this.mobile,
      marketChannelId: channel
    });

    const { url, weixin } = res.data;

    this.goQrCode({
      url,
      weixin
    });
  };

  goQrCode = ({ url, weixin }) => {
    const { router } = getCurrentInstance();
    const channel = router.params.channel;
    const replaceStr = `?channel=${channel}&pageId=2&url=${encodeURIComponent(
      url
    )}&wxName=${weixin}`;
    const _path = router.path.replace(/\?channel=[a-zA-Z0-9=]*/, replaceStr);

    const replaceStr2 = `&channel=${channel}&pageId=2&url=${encodeURIComponent(
      url
    )}&wxName=${weixin}`;
    const path = _path.replace(/&channel=[a-zA-Z0-9=]*/, replaceStr2);
    Taro.redirectTo({
      url: path
    });
  };

  dayuwenSendSms = async () => {
    const { channel } = this.state;
    const res = await request('/xinmai-order/dayuwen-send-sms', {
      mobile: this.mobile,
      marketChannelId: channel,
      captchaVerificationCode: this.imgData.imgCaptcha,
      captchaUuid: this.imgData.imgCaptchaUuid
    });

    if (res.code === 100004) {
      Taro.showToast({
        title: res.msg,
        icon: 'none',
        duration: 1000
      });
      this.getCaptcha();
      return;
    }

    Taro.showToast({
      title: res.msg,
      icon: 'none',
      duration: 1000,
      mask: true
    });

    const { visible } = this.state;
    if (!visible) {
      this.toogleCodeModal(true);
      this.toogleImgModal(false);
    }
  };

  toogleCodeModal = (visible) => {
    this.setState({
      visible: visible
    });
  };
  toogleImgModal = (visible) => {
    this.setState({
      visibleImg: visible
    });
  };

  render() {
    const { visible, visibleImg, base64Img, inputValue } = this.state;
    const { canDrag } = this.props;

    return (
      <>
        <View
          style={{
            height: getElementSize(canDrag, 73)
          }}
          className={styles.inputContentWrapper}
        >
          <Input
            placeholder='请输入手机号'
            maxlength={11}
            value={inputValue}
            onInput={this.handleChange}
            type='tel'
            style={{
              width: getElementSize(canDrag, 240),
              height: getElementSize(canDrag, 36),
              fontSize: getElementSize(canDrag, 16),
              marginLeft: getElementSize(canDrag, 17)
            }}
          />
          <View
            onClick={this.handleSubmit}
            style={{
              opacity: canDrag ? '0' : '0',
              marginRight: getElementSize(canDrag, 10),
              width: getElementSize(canDrag, 200),
              height: getElementSize(canDrag, 50)
            }}
            className={styles.submit}
          />
        </View>

        {visible ? (
          <CodeModal
            showSendSmsAuthCode={this.showSendSmsAuthCode}
            submitMarketLeads={this.submitMarketLeads}
            dayuwenSendSms={this.dayuwenSendSms}
            toogleCodeModal={this.toogleCodeModal}
            visible={visible}
            inputValue={inputValue}
          />
        ) : null}
        {visibleImg ? (
          <ImgCodeModal
            visible={visibleImg}
            base64Img={base64Img}
            getCaptcha={this.getCaptcha}
            submit={this.submit}
            updateImgData={this.updateImgData}
          />
        ) : null}
      </>
    );
  }
}

export default InputContent;
