import React, { Component } from 'react';
import { View, Input, Image } from '@tarojs/components';
import { fixInputBugs } from '@/utils/fixInputBugs';

import RootModal from '../rootModal';
import messageIcon from './assets/messageIcon.png';
import style from './codeModal.module.scss';

class ImageCodeModal extends Component {
  state = {
    imgCodeValue: ''
  };
  componentDidMount() {
    fixInputBugs();
  }

  validateFields = () => {
    const { updateImgData, submit } = this.props;
    const { imgCodeValue } = this.state;
    this.setState({
      imgCodeValue: ''
    });
    updateImgData({
      imgCaptcha: imgCodeValue
    });
    submit();
  };

  imgCodeChange = (e) => {
    const imgCodeValue = e.target.value;
    this.setState({
      imgCodeValue
    });
  };

  render() {
    const { visible, base64Img, getCaptcha } = this.props;
    const { imgCodeValue } = this.state;
    return (
      <RootModal visible={visible}>
        <View className={style.modalWrapper}>
          <View className={style['phone-input-content-title']}>填写动态码</View>
          <View className={style['input-box']}>
            <Image className={style.messageIcon2} src={messageIcon} />
            <Input
              maxlength={4}
              onInput={this.imgCodeChange}
              value={imgCodeValue}
              placeholder='请输入图形验证码'
            />
            <View
              className={`
                ${style['phone-input-content-resend2']}
              `}
              onClick={getCaptcha}
            >
              <Image className={style.base64img} src={base64Img} />
            </View>
          </View>

          <View className={style['phone-input-content-valid']}>
            <View
              style={{
                opacity: imgCodeValue.length === 4 ? '1' : '0.3',
                pointerEvents: imgCodeValue.length === 4 ? 'all' : 'none'
              }}
              className={style['phone-input-content-validbtn']}
              onClick={this.validateFields}
            >
              确认
            </View>
          </View>
        </View>
      </RootModal>
    );
  }
}
export default ImageCodeModal;
