import React from 'react';
import { View, Image } from '@tarojs/components';
import { request } from '@/request';
import close from './close.png';
import bg from './bg.png';
import hand from './hand.png';
import styles from './index.module.scss';

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
    const { showModal, serviceQrCode } = this.props;

    return showModal ? (
      <View className={styles['addTeacher-wrapper']}>
        <View className={styles['addTeacher-box']}>
          <Image onClick={this.closeModal} className={styles.close} src={close} />

          <View className={styles.text1}>添加老师开课</View>
          <View className={styles.text2}>请务必添加专属顾问，提前锁定开课名额</View>
          <Image className={styles.bg} src={bg} />

          <View className={styles.codeBox}>
            <Image className={styles.code} src={serviceQrCode} />
          </View>

          <View className={styles.tips}>
            <Image className={styles.hand} src={hand} />
            长按二维码添加
          </View>
        </View>
      </View>
    ) : null;
  }
}

export default InviteSuccess;
