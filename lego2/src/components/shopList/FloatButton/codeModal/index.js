import React, { Component } from 'react';
import { getCurrentInstance } from '@tarojs/taro';
import { View, Text, Input, Image } from '@tarojs/components';
import { request } from '@/request';
import { fixInputBugs } from '@/utils/fixInputBugs';
import { debounce } from '@/utils/bom';

import UserModal from '../component-modal';
import RootModal from '../rootModal';
import messageIcon from './assets/messageIcon.png';
import style from './codeModal.module.scss';

class codeModal extends Component {
  state = {
    clicked: true,
    time: 60,
    protocoId: '',
    hideModal: false,
    codeValue: ''
  };

  componentDidMount() {
    fixInputBugs();
    this.handleCodeUi();
  }

  componentWillUnmount() {
    this.resetCodeStatus();
  }

  _handleClickCode = () => {
    this.setState({
      codeValue: ''
    });
    const { showSendSmsAuthCode } = this.props;
    showSendSmsAuthCode();
    this.handleCodeUi();
  };

  handleClickCode = debounce(this._handleClickCode, 1000, true);

  handleCodeUi = () => {
    this.setState({
      clicked: true
    });

    this.intervalTimer = setInterval(() => {
      if (this.state.time === 0) {
        this.resetCodeStatus();
      } else {
        this.setState({
          time: this.state.time - 1
        });
      }
    }, 1000);
  };

  resetCodeStatus = () => {
    clearInterval(this.intervalTimer);
    this.intervalTimer = null;
    this.setState({
      time: 60,
      clicked: false
    });
  };

  _validateFields = () => {
    const { submitMarketLeads } = this.props;
    const { codeValue } = this.state;
    submitMarketLeads({
      verificationCode: codeValue
    });
  };

  validateFields = debounce(this._validateFields, 1000, true);

  showModal = (protocoId) => {
    this.setState({
      hideModal: true,
      protocoId
    });
  };

  codeChange = (e) => {
    const codeValue = e.target.value;
    this.setState({
      codeValue
    });
  };

  hideModal = () => {
    this.setState({
      hideModal: false,
      protocoId: ''
    });
  };

  render() {
    const { visible, inputValue } = this.props;
    const { clicked, time, hideModal, protocoId, codeValue } = this.state;
    return (
      <>
        <RootModal visible={visible}>
          <View className={style.modalWrapper}>
            <View className={style['phone-input-content-title']}>填写动态码</View>
            <View className={style['input-box']}>
              <Image className={style.messageIcon2} src={messageIcon} />
              <Input
                maxlength={6}
                onInput={this.codeChange}
                value={codeValue}
                placeholder='请输入短信验证码'
              />

              <View
                style={{
                  opacity: clicked ? 0.3 : 1,
                  pointerEvents: clicked ? 'none' : 'all'
                }}
                className={`
                  ${style['phone-input-content-resend']}
                  ${clicked ? null : style['active']}
                `}
                onClick={this.handleClickCode}
              >
                {clicked ? `${time}s` : '获取验证码'}
              </View>
            </View>

            <View className={style['phone-input-content-tips']}>
              短信验证码已发送至 <Text className={style.blue}>{inputValue}</Text>
            </View>
            <View className={style['phone-input-content-valid']}>
              <View
                style={{
                  opacity: codeValue.length === 6 ? '1' : '0.3',
                  pointerEvents: codeValue.length === 6 ? 'all' : 'none'
                }}
                className={style['phone-input-content-validbtn']}
                onClick={this.validateFields}
              >
                确认
              </View>
            </View>

            <View className={style['protocol-box']}>
              确认即代表您已同意
              <Text className={style.blue} onClick={() => this.showModal(1)}>
                《用户协议》
              </Text>
              和
              <Text className={style.blue} onClick={() => this.showModal(2)}>
                《隐私协议》
              </Text>
            </View>
          </View>
        </RootModal>

        <RootModal visible={hideModal}>
          <UserModal modal1={hideModal} hideModal={this.hideModal} id={protocoId} />
        </RootModal>
      </>
    );
  }
}
export default codeModal;
