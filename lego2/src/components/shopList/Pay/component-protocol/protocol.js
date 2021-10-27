import React from 'react';
import { View, Image } from '@tarojs/components';
import { request } from '@/request';
import { judgeClient } from '@/utils/judgeClient';
import close from './close_btn.png';
import styles from './protocol.module.scss';

class Protocol extends React.Component {
  state = {
    buttonActive: this.props.isOrderDetail,
    isAndroid: false,
    protocolData: {
      name: '',
      content: ''
    }
  };

  componentDidMount() {
    document.body.className = 'modal-open';
    const isAndroid = judgeClient() === 'Android';
    this.setState({
      isAndroid
    });
    this.handleGetProtocol();
  }

  componentWillUnmount() {
    document.body.className = '';
  }

  handleGetProtocol = async () => {
    const res = await request('/xinmai-order/protocol', { id: this.props.id });
    if (res.success) {
      this.setState({
        protocolData: res.data
      });
    }
  };

  onScroll = () => {
    const dom = document.getElementById('content');
    if (!dom) {
      return;
    }
    if (this.state.buttonActive) return;
    if (dom.clientHeight + dom.scrollTop + 10 >= dom.scrollHeight) {
      this.setState({
        buttonActive: true
      });
    }
  };

  handleSubmitOrder = () => {
    const { isOrderDetail, CloseProtocolModal } = this.props;
    if (isOrderDetail) {
      CloseProtocolModal();
      return;
    }

    const { submitOrder } = this.props;
    if (!this.state.buttonActive) {
      return;
    }
    CloseProtocolModal();
    submitOrder();
  };

  render() {
    const { CloseProtocolModal, ProtocolModal, isOrderDetail } = this.props;
    const { content, name } = this.state.protocolData;

    return ProtocolModal ? (
      <View className={styles['protocol-wrapper']}>
        <View
          className={`
          ${this.state.isAndroid ? styles['protocol-height'] : ''}
          ${styles['protocol-box']}
        `}
        >
          <View className={styles.title}>{name}</View>
          <View
            dangerouslySetInnerHTML={{
              __html: content
            }}
            id='content'
            className={styles.content}
            onScroll={this.onScroll}
          />
          <View
            className={`
              ${this.state.buttonActive ? styles.active : ''}
              ${styles['protocol-button']}  
            `}
            onClick={this.handleSubmitOrder}
          >
            {isOrderDetail ? '已同意' : '同意并继续'}
          </View>

          <View className={styles['protocol-bottom-text']}>*阅读完协议，即可继续</View>

          <Image src={close} className={styles.close} onClick={CloseProtocolModal} />
        </View>
      </View>
    ) : null;
  }
}

export default Protocol;
