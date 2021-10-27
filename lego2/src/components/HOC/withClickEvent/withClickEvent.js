import React, { memo, useContext } from 'react';
import { View, Image, Button } from '@tarojs/components';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { deCodeStr } from '@/utils/deCodeStr';
import { request } from '@/request';
import LoginModal from './LoginModal';

function withClickEvent(WrappedComponent) {
  return class extends React.Component {
    state = {
      isShowLoginModal: false,
      lessonId: '',
      clickEvent: 1,
      channel: deCodeStr(getCurrentInstance().router.params.channel || '')
    };

    componentDidMount() {}

    /**
     * clickEvent=3  -> 某个业务功能：）
     * clickEvent=4  -> 邀请助力
     */
    handleClick = () => {
      const { clickEvent, h5Url, scrollTop, lessonId } = this.props;
      switch (clickEvent) {
        case 1:
          this.goH5(h5Url);
          break;

        case 2:
          this.goTop(scrollTop);
          break;
        case 3:
          this.setState({ lessonId, clickEvent }, () => {
            this.checkLogin();
          });
          break;
        case 4:
          this.setState({ lessonId, clickEvent }, () => {
            this.checkLogin();
          });
          break;
        default:
          break;
      }
    };

    goH5 = (h5Url) => {
      window.location.href = h5Url;
    };

    goTop = (scrollTop) => {
      const top = +scrollTop === 0 ? 1 : scrollTop;
      Taro.pageScrollTo({
        scrollTop: top,
        duration: 300
      });
    };

    checkLogin = async () => {
      const res = await request('/xinmai-user/check-token');
      if (res.success) {
        if (res.data.isValid === 1) {
          const { clickEvent } = this.state;
          clickEvent === 3 ? this.goPay() : this.goTeamUp();
        } else {
          localStorage.clear();
          this.toogleLoginModal(true);
        }
      }
    };

    goPay = async () => {
      const { router } = getCurrentInstance();
      const channel = router.params.channel;
      const { lessonId } = this.state;
      const res = await request('/xinmai-order/query-product-order-status', {
        id: lessonId
      });
      // 已经支付
      if (res.data.status === 3) {
        this.goPaySuccess();
        return;
      }

      // 支付页面pageId始终保持为2，参考 @/utils/const文件
      const replaceStr = `&pageId=2&lessonId=${lessonId}&channel`;
      const _path = router.path.replace(/&channel/, replaceStr);

      const replaceStr2 = `?channel=${channel}&pageId=2&lessonId=${lessonId}`;
      const path = _path.replace(/\?channel=[a-zA-Z0-9=]*/, replaceStr2);
      Taro.redirectTo({
        url: path
      });
    };

    toogleLoginModal = (isShowLoginModal) => {
      this.setState({ isShowLoginModal });
    };

    goTeamUp = () => {
      const { router } = getCurrentInstance();
      const channel = router.params.channel;

      // 助力页面pageId始终保持为4，参考 @/utils/const文件
      const replaceStr = `&pageId=4&channel`;
      const _path = router.path.replace(/&channel/, replaceStr);

      const replaceStr2 = `?channel=${channel}&pageId=4`;
      const path = _path.replace(/\?channel=[a-zA-Z0-9=]*/, replaceStr2);
      Taro.redirectTo({
        url: path
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
      const { lessonId } = this.state;
      const { router } = getCurrentInstance();
      const channel = router.params.channel;

      // 存在支付页面的时候，报名成功页面pageId始终保持为3，参考 @/utils/const文件
      const replaceStr = `&pageId=3&lessonId=${lessonId}&channel`;
      const _path = router.path.replace(/&channel/, replaceStr);

      const replaceStr2 = `?channel=${channel}&pageId=3&lessonId=${lessonId}`;
      const path = _path.replace(/\?channel=[a-zA-Z0-9=]*/, replaceStr2);

      const path2 = path.replace(
        /&pageId=3/,
        `&pageId=3&url=${encodeURIComponent(url)}&wxName=${weixin}`
      );

      Taro.redirectTo({
        url: path2
      });
    };

    render() {
      const { isShowLoginModal } = this.state;
      return (
        <>
          <WrappedComponent {...this.props} handleClick={this.handleClick} />
          {isShowLoginModal ? (
            <LoginModal
              checkLogin={this.checkLogin}
              toogleLoginModal={this.toogleLoginModal}
            />
          ) : null}
        </>
      );
    }
  };
}

export default withClickEvent;
