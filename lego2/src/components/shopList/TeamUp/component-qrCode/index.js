import React, { useState, useEffect, useContext } from 'react';
import Taro from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';

import QRCode from 'qrcode.react';

import qrCodeClose from './qr-code-close.png';
// import howToInvite from './howToInvite.png';
import tips from './tips.png';
import hand from './hand.png';

import styles from './index.module.scss';

const QrCode = ({ toogleQrCode, shareData }) => {
  const [imgSrc, setImgSrc] = useState('');

  const blobToDataURI = (blob, callback) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      callback(e.target.result);
    };
    reader.readAsDataURL(blob);
  };

  useEffect(() => {
    blobToDataURI(shareData, (data) => {
      setImgSrc(data);
    });
  }, []);

  // useEffect(() => {
  //   if (imgSrc) {
  //     renderCanvas();
  //   }
  // }, [imgSrc]);

  return (
    <View className={styles['qr-code-mask']}>
      <Image
        onClick={() => {
          toogleQrCode(false);
        }}
        className={styles['qr-code-close']}
        src={qrCodeClose}
      />

      <View className={`pic-container ${styles['qr-code']}`}>
        {/* {pic ? (
          <Image
            src={pic}
            className={styles['share-img-canvas']}
            data-html2canvas-ignore='true'
          />
        ) : null} */}

        {imgSrc ? <Image src={imgSrc} className={styles['share-img']} /> : null}

        <View className={styles['qr-code-tips2']}>
          <Image className={styles.hand} src={hand} />
          长按图片可转发
        </View>

        <View className={styles['qr-code-tips']}>
          <Image className={styles.tips} src={tips} />
          96.7%的家长转发到家长群后组队成功
        </View>
      </View>
    </View>
  );
};

export default QrCode;
