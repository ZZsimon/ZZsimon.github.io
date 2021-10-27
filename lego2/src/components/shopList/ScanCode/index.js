import React, { memo, useEffect, useState } from 'react';
import { deCodeStr } from '@/utils/deCodeStr';
import Taro, { useRouter } from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import { getElementSize } from '@/utils/getElementSize';
import { copyWords } from '@/utils/copyWords';
import { isWeixinCient } from '@/utils/isWeixinCient';

import styles from './index.module.scss';

const ImgButton = memo(
  ({
    title,
    isTpl,
    canDrag,
    bgUrl,
    bgColor,
    codeSize: [{ value: codeSizeWidth }, { value: codeSizeHeight }],
    marginTop,
    ifShowWX,
    fontColor,
    height
  }) => {
    const router = useRouter();
    const { channel = '', url = '', wxName = '' } = router.params;

    const [qrCode, setqrCode] = useState(decodeURIComponent(url));
    const [weixin, setweixin] = useState(wxName);

    const _hmtReport = () => {
      window._hmt.push(['_trackPageview', window.location.href + deCodeStr(channel)]);
    };
    useEffect(() => {
      if (!canDrag) {
        _hmtReport();
        setqrCode(decodeURIComponent(url));
        setweixin(wxName);
      }
    }, []);

    const handleCopyWords = () => {
      copyWords(weixin);
      Taro.showToast({ title: '复制成功', icon: 'none' });
      const isWx = isWeixinCient();
      if (!isWx) {
        window.location.href = 'weixin://';
      }
    };

    return (
      <>
        {isTpl && (
          <View className={styles.imgTpl}>
            <Image
              className={styles.image}
              src='https://resource.xinmai100.com/authUser/2021032511230573317672.png'
            />
            <View className={styles.title}>{title}</View>
          </View>
        )}

        {!isTpl && (
          <View
            style={{
              backgroundColor: bgColor,
              height: canDrag ? '667px' : `100vh`
            }}
            className={canDrag ? styles.eventsNone : ''}
          >
            <Image
              style={{ height: getElementSize(canDrag, height) }}
              className={styles.bgUrl}
              src={bgUrl}
            />

            <View className={styles.contentBg}>
              {qrCode ? (
                <Image
                  style={{
                    width: getElementSize(canDrag, codeSizeWidth),
                    height: getElementSize(canDrag, codeSizeHeight),
                    marginTop: getElementSize(canDrag, marginTop)
                  }}
                  className={`${styles.code} ${styles.preview}`}
                  src={qrCode}
                />
              ) : (
                <View
                  style={{
                    width: getElementSize(canDrag, codeSizeWidth),
                    height: getElementSize(canDrag, codeSizeHeight),
                    marginTop: getElementSize(canDrag, marginTop)
                  }}
                  className={styles.code}
                >
                  <View className={styles.text}>二维码区域</View>
                </View>
              )}

              {ifShowWX && weixin ? (
                <View className={`${styles.wxWrapper} ${styles.preview}`}>
                  <Text style={{ color: fontColor }} className={styles.wx}>
                    {weixin}
                  </Text>
                  <Text onClick={handleCopyWords} className={styles.copy}>
                    点此复制
                  </Text>
                </View>
              ) : null}

              {ifShowWX && canDrag ? (
                <View className={styles.wxWrapper}>
                  <Text style={{ color: fontColor }} className={styles.wx}>
                    微信号区域
                  </Text>
                  <Text className={styles.copy}>点此复制</Text>
                </View>
              ) : null}
            </View>
          </View>
        )}
      </>
    );
  }
);

export default ImgButton;
