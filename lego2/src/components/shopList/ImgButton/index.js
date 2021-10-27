import React, { memo } from 'react';
import { View, Image, Button } from '@tarojs/components';
import withClickEvent from '@/components/HOC/withClickEvent/withClickEvent';
import { getElementSize } from '@/utils/getElementSize';
import Taro from '@tarojs/taro';

import styles from './index.module.scss';

const ImgButton = memo((props) => {
  const {
    title,
    isTpl,
    canDrag,
    height,
    clickEvent,
    refundAuthorize,
    h5Url,
    scrollTop,
    lessonId,
    bgUrl
  } = props;

  const getPhoneNumber = (e) => {
    if (e.detail && e.detail.errMsg === 'getPhoneNumber:ok') {
      // this.getExample(e);
    } else {
      Taro.showModal({
        content: refundAuthorize,
        confirmText: '知道了',
        showCancel: false
      });
    }
  };

  const getContactDetail = () => {};

  return (
    <>
      {isTpl && (
        <View className={styles.imgTpl}>
          <Image
            className={styles.image}
            src='https://resource.xinmai100.com/authUser/2021032511030570376929.png'
          />
          <View className={styles.title}>{title}</View>
        </View>
      )}

      {!isTpl && clickEvent !== 4 && clickEvent !== 5 && <Comp2 {...props} />}
      {clickEvent === 4 && (
        <Button
          className={styles.wxImgButton}
          onGetPhoneNumber={getPhoneNumber}
          openType='getPhoneNumber'
        >
          <Image className={styles.wxImg} src={bgUrl} />
        </Button>
      )}
      {clickEvent === 5 && (
        <Button
          className={styles.wxImgButton}
          onContactEventDetail={getContactDetail}
          openType='contact'
        >
          <Image className={styles.wxImg} src={bgUrl} />
        </Button>
      )}
    </>
  );
});

const Comp2 = withClickEvent((props) => {
  const {
    canDrag,
    height,
    // hoc传过来的
    handleClick,
    bgUrl
  } = props;
  return (
    <View
      style={{ height: getElementSize(canDrag, height) }}
      className={`${styles.imageWrapper} ${canDrag ? styles.eventsNone : ''}`}
      onClick={handleClick}
    >
      <Image className={styles.image} src={bgUrl} />
    </View>
  );
});

export default ImgButton;
