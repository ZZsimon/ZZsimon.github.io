import React from 'react';
import { View, Image } from '@tarojs/components';
import { request } from '@/request';
import { judgeClient } from '@/utils/judgeClient';
import success from './success.png';
import styles from './inviteSuccess.module.scss';

class InviteSuccess extends React.Component {
  state = {};

  componentDidMount() {
    document.body.className = 'modal-open';
  }

  componentWillUnmount() {
    document.body.className = '';
  }

  closeModal = () => {
    this.props.toogleModal(false);
  };

  render() {
    const { showModal } = this.props;

    return showModal ? (
      <View onClick={this.closeModal} className={styles['invite-success-wrapper']}>
        <View className={styles['invite-box']}>助力成功</View>
        <Image className={styles.success} src={success} />
      </View>
    ) : null;
  }
}

export default InviteSuccess;
