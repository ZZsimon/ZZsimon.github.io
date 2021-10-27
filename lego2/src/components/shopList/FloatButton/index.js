import React, { memo, useEffect } from 'react';
import { View, Image, Text } from '@tarojs/components';
import { getElementSize } from '@/utils/getElementSize';
import InitNumber from './initNumber';
import InputContent from './inputContent';

import withClickEvent from '@/components/HOC/withClickEvent/withClickEvent';

import styles from './index.module.scss';

const FloatButton = memo((props) => {
  const {
    areaSize,
    title,
    isTpl,
    canDrag,
    height,
    bgUrl,
    initNumber,
    fontColor,
    floatType,
    smsCode,
    position
  } = props;

  useEffect(() => {
    if (canDrag) {
      return;
    }
  }, []);

  return (
    <>
      {isTpl && (
        <View className={styles.imgTpl}>
          <Image
            className={styles.image}
            src='https://resource.xinmai100.com/authUser/2021032511171930145001.png'
          />
          <View className={styles.title}>{title}</View>
        </View>
      )}
      {!isTpl && (
        <View
          style={{
            height: getElementSize(canDrag, height),
            backgroundImage: `url('${bgUrl}')`
          }}
          className={`${styles.imageWrapper} ${canDrag ? styles.eventsNone : ''}`}
        >
          {floatType === 1 ? <InputContent canDrag={canDrag} smsCode={+smsCode} /> : null}

          {floatType === 1 ? (
            <InitNumber canDrag={canDrag} initNumber={+initNumber} fontColor={fontColor} />
          ) : null}

          {floatType === 0 ? <Comp2 {...props} /> : null}
        </View>
      )}
    </>
  );
});

const Comp2 = withClickEvent((props) => {
  const {
    position,
    canDrag,
    areaSize,
    // hoc传过来的
    handleClick
  } = props;
  return (
    <Text
      style={{
        width: getElementSize(canDrag, areaSize[0].value),
        height: getElementSize(canDrag, areaSize[1].value),
        left: getElementSize(canDrag, position[0].value),
        top: getElementSize(canDrag, position[1].value),
        fontSize: getElementSize(canDrag, 16),
        backgroundColor: canDrag ? 'rgba(0,0,0,0.3)' : 'transparent'
      }}
      onClick={handleClick}
      className={styles.floatClick}
    >
      {canDrag ? '点击区域' : ''}
    </Text>
  );
});

export default FloatButton;
