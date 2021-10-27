import Taro, { getCurrentInstance } from '@tarojs/taro';
import React, { Component } from 'react';
import { View, Input, Text, Image } from '@tarojs/components';
import { request } from '@/request';
import { deCodeStr } from '@/utils/deCodeStr';

import Protocol from './component-protocol';
import Modal from './modal';

import close from './assets/close.png';
import code from './assets/code.png';
import imgCode from './assets/imgCode.png';
import tel from './assets/tel.png';
import styles from './login.module.scss';

class Login extends Component {
  state = {
    clicked: false,
    emitCode: false,
    hasTelError: true,
    time: 60,

    channel: deCodeStr(getCurrentInstance().router.params.channel || ''),

    telValue: '',
    codeValue: '',
    imgCodeValue: '',
    showImgInput: false,
    uuid: '',
    base64Img: '',

    ProtocolModal: false,
    ProtocolId: ''
  };

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  getCodeText = () => {
    const { clicked, time, emitCode } = this.state;
    if (emitCode) {
      return '发送中';
    }

    if (clicked) {
      return `${time} s`;
    }
    return '获取验证码';
  };

  handleClickCode = async () => {
    if (this.getCodeDisaled()) {
      return;
    }
    const { telValue, imgCodeValue, uuid } = this.state;

    if (uuid && !imgCodeValue) {
      Taro.showToast({
        title: '请输入图形验证码',
        icon: 'none',
        duration: 1000
      });
      return;
    }

    this.setState({
      emitCode: true
    });
    const res = await request('/xinmai-order/send-sms', {
      bizType: 11,
      mobile: telValue,
      captcha: imgCodeValue,
      uuid: uuid
    });
    console.log(res, 'res');
    this.setState({
      emitCode: false
    });

    Taro.showToast({
      title: res.msg,
      icon: 'none',
      duration: 1000,
      mask: true
    });

    if (res.code === 100019) {
      this.setState({ showImgInput: true });
      this.getCaptcha();
      return;
    }
    if (res.code === 100004) {
      this.setState({ imgCodeValue: '' });
      this.getCaptcha();
      return;
    }
    if (res.code === 200) {
      this.handleCodeUi();
    }
  };

  handleCodeUi = () => {
    this.setState({
      clicked: true
    });
    let { time } = this.state;
    const timer = setInterval(() => {
      if (time === 0) {
        clearInterval(timer);
        this.setState({
          clicked: false,
          time: 60
        });
      } else {
        time -= 1;
        this.setState({
          time
        });
      }
    }, 1000);
  };

  handleTelChange = (e) => {
    const value = e.target.value;

    if (value[0] === '1' && value.length === 11) {
      this.setState({
        hasTelError: false
      });
    } else {
      this.setState({
        hasTelError: true
      });
    }

    this.setState({
      telValue: value
    });
  };

  handleCodeChange = (e) => {
    const codeValue = e.target.value;
    this.setState({
      codeValue
    });
  };
  handleImgCodeChange = (e) => {
    const imgCodeValue = e.target.value;
    this.setState({
      imgCodeValue
    });
  };

  getCodeDisaled = () => {
    const { clicked, hasTelError, emitCode } = this.state;
    if (!clicked && !hasTelError && !emitCode) {
      return false;
    }
    return true;
  };

  login = async () => {
    const { telValue, codeValue, submitLoading } = this.state;
    if (!telValue || !codeValue) {
      Taro.showToast({
        title: '请输入手机号和验证码',
        icon: 'none',
        duration: 1000
      });
      return;
    }

    if (submitLoading) {
      return;
    }

    const { channel } = this.state;
    const openid = Taro.getStorageSync('openid');
    const appid = Taro.getStorageSync('appid');
    const data = {
      ...getCurrentInstance().router.params,
      marketChannelId: channel,

      openid,
      appid,
      url: window.location.href,
      mobile: telValue,
      verificationCode: codeValue
    };
    this.setState({
      submitLoading: true
    });
    const res = await request('/xinmai-user/vc-login', data);

    if (res.code === 100015) {
      Taro.showToast({
        title: '账号将被冻结',
        icon: 'none',
        duration: 1000,
        mask: true
      });
      this.setState({
        submitLoading: false
      });
      return;
    }
    if (res.code === 100016) {
      Taro.showToast({
        title: '账号已冻结,请5分钟后再试',
        icon: 'none',
        duration: 1000,
        mask: true
      });
      this.setState({
        submitLoading: false
      });
      return;
    }
    if (!res.success) {
      Taro.showToast({
        title: res.msg,
        icon: 'none',
        duration: 1000
      });
      this.setState({
        submitLoading: false
      });
      return;
    }
    Taro.setStorageSync('front-token', res.data.accessToken);
    Taro.setStorageSync('front-mobile', res.data.mobile);
    this.props.checkLogin();
  };

  CloseProtocolModal = () => {
    this.setState({
      ProtocolModal: false,
      ProtocolId: ''
    });
  };

  showProtocolModal = (ProtocolId) => {
    this.setState({
      ProtocolModal: true,
      ProtocolId
    });
  };

  getCaptcha = async () => {
    const { telValue, imgCodeValue } = this.state;
    const res = await request('/xinmai-order/captcha', {
      bizType: 11,
      mobile: telValue,
      captcha: imgCodeValue
    });

    if (res.success) {
      this.setState({
        uuid: res.data.uuid,
        base64Img: `data:image/png;base64,${res.data.base64}`
      });
    }
  };

  render() {
    const { toogleLoginModal } = this.props;
    const {
      base64Img,
      showImgInput,
      ProtocolId,
      ProtocolModal,
      codeValue,
      imgCodeValue,
      telValue
    } = this.state;

    return (
      <Modal>
        <View className={styles.loginModalWrapper}>
          <View className={styles.loginModalBox}>
            <Image
              onClick={() => toogleLoginModal(false)}
              className={styles.close}
              src={close}
            />

            <View className={styles.title}>登录/注册后即可享活动福利</View>

            <View className={styles.inputWrapper}>
              <Image className={styles.tel} src={tel} />

              <View className={styles.area}>+86</View>

              <Input
                placeholder='请输入手机号'
                value={telValue}
                onInput={this.handleTelChange}
                className={styles.input}
                type='tel'
                maxlength={11}
                autoFocus
              />
            </View>

            {showImgInput ? (
              <View className={styles.inputWrapper}>
                <Image className={styles.imgCode} src={imgCode} />

                <Input
                  placeholder='请输入图形验证码'
                  value={imgCodeValue}
                  onInput={this.handleImgCodeChange}
                  className={styles.input}
                  type='text'
                  maxlength={4}
                />

                <Text onClick={this.getCaptcha} className={styles.getImgCode}>
                  <Image className={styles.img} src={base64Img} />
                </Text>
              </View>
            ) : null}

            <View className={styles.inputWrapper}>
              <Image className={styles.code} src={code} />

              <Input
                placeholder='请输入短信验证码'
                value={codeValue}
                onInput={this.handleCodeChange}
                className={styles.input}
                type='tel'
                maxlength={6}
              />
              <Text
                style={{
                  opacity: this.getCodeDisaled() ? '0.5' : '1'
                }}
                onClick={this.handleClickCode}
                className={styles.getCode}
              >
                {this.getCodeText()}
              </Text>
            </View>

            <View className={styles.loginWrapper} onClick={this.login}>
              登录
            </View>

            <View className={styles.tipsWrapper}>
              <View className={styles.tips1}>
                <View className={styles.text}>
                  同意
                  <Text onClick={() => this.showProtocolModal(1)} className={styles.text2}>
                    《用户协议》
                  </Text>
                  和
                  <Text onClick={() => this.showProtocolModal(2)} className={styles.text2}>
                    《隐私协议》
                  </Text>
                </View>
              </View>
              {/* <View className={styles.tips2}>
                登录后才能体验课程哦～我们会对您的信息严格保密
              </View> */}
            </View>
          </View>

          {ProtocolModal ? (
            <Protocol
              id={ProtocolId}
              CloseProtocolModal={this.CloseProtocolModal}
              ProtocolModal={ProtocolModal}
            />
          ) : null}
        </View>
      </Modal>
    );
  }
}

export default Login;
