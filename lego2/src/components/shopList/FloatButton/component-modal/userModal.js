import React, { Component } from 'react';
import { View, Image } from '@tarojs/components';
import { request } from '@/request';
import closeBtn from './close_btn.png';
import styles from './userMoal.module.scss';
// import { getProtocol } from '../../api/common';

class UserModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        content: '',
        name: ''
      }
    };
  }

  componentDidMount() {
    document.body.className = 'modal-open';
    this.handleGetProtocol();
  }

  componentWillUnmount() {
    document.body.className = '';
  }

  handleGetProtocol = async () => {
    const { id } = this.props;
    const res = await request('/xinmai-order/protocol', { id });
    this.setState({
      data: res.data
    });
  };

  render() {
    const { modal1, id, hideModal, title } = this.props;
    const { content, name } = this.state.data;
    return modal1 ? (
      <View>
        <View className={styles['coperation-modal']}>
          <View className={styles.title}>{name}</View>
          {id ? (
            <View
              className={styles.text}
              dangerouslySetInnerHTML={{
                __html: content
              }}
            />
          ) : null}
          <View
            onClick={() => {
              hideModal(title);
            }}
            className={styles['close-button']}
          >
            <Image src={closeBtn} className={styles['close-coperation']} />
          </View>
        </View>
        <View className={styles['login-mask']}></View>
      </View>
    ) : null;
  }
}

export default UserModal;
