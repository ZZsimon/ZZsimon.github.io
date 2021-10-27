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

  render() {
    const { CloseProtocolModal, ProtocolModal } = this.props;
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
          />

          <Image src={close} className={styles.close} onClick={CloseProtocolModal} />
        </View>
      </View>
    ) : null;
  }
}

export default Protocol;
