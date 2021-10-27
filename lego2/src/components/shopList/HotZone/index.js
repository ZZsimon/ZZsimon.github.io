import React, { memo, useContext } from 'react';
import { View, Image, Button } from '@tarojs/components';
import { getElementSize } from '@/utils/getElementSize';
import withClickEvent from '@/components/HOC/withClickEvent/withClickEvent';
import styles from './index.module.scss';

const HotZone = (props) => {
  const { isTpl, title } = props;
  return (
    <>
      {isTpl && (
        <View className={styles.imgTpl}>
          <Image
            className={styles.image}
            src='https://resource.xinmai100.com/authUser/2021052714263617413790.png'
          />
          <View className={styles.title}>{title}</View>
        </View>
      )}

      {!isTpl && <Comp2 {...props} />}
    </>
  );
};

const Comp2 = withClickEvent((props) => {
  const {
    canDrag,
    areaSize,
    isFloat,
    // hoc传过来的
    handleClick
  } = props;
  return (
    <View
      style={{
        width: getElementSize(canDrag, areaSize[0].value),
        height: getElementSize(canDrag, areaSize[1].value)
      }}
      className={`${styles.imageWrapper} ${
        canDrag ? styles.eventsNone : styles.removeBgColor
      }`}
      onClick={handleClick}
    >
      {isFloat === 1 && canDrag ? '悬浮' : null}
      {isFloat === 0 && canDrag ? '非悬浮' : null}
    </View>
  );
});

export default HotZone;
