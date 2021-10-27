import Taro, { useRouter } from '@tarojs/taro';
import React, { memo, useContext, useState, useEffect } from 'react';
import { encode } from 'js-base64';
import QRCode from 'qrcode.react';
import { View, Button } from '@tarojs/components';
import PageContext from '@/components/pageContext';
import { request } from '@/request';

import styles from './index.module.scss';

const typeList = {
  1: 'H5',
  2: '小程序'
};

const Header = memo(() => {
  const router = useRouter();
  const { topicId = '' } = router.params;
  const pageData = useContext(PageContext);
  const { submit, publish, setvisible, pageInfo } = pageData;
  const _pageInfo = pageInfo ? pageInfo : {};
  const { pageTitle, pageType, isPublish } = _pageInfo;

  const [showQrcode, setshowQrcode] = useState(false);
  const [qrcode, setqrcode] = useState('');

  const setPage = () => {
    setvisible(true);
  };

  const save = () => {
    submit(() =>
      Taro.showToast({
        title: '保存成功',
        icon: 'none',
        duration: 1000,
        mask: true
      })
    );
  };

  const toPreview = () => {
    submit(() => {
      const str = `topicId=${encode(topicId)}`;
      const _path = router.path.replace(/home/, 'activity');
      const path = _path.replace(/topicId=[0-9]*/, str);
      window.open(path);
    });
  };

  const _publish = () => {
    publish();
  };

  const toQrcode = (e) => {
    e.stopPropagation();
    submit(getQrCode);
  };

  const _setshowQrcode = () => {
    setshowQrcode(false);
  };

  useEffect(() => {
    document.addEventListener('click', _setshowQrcode);
    return () => {
      document.removeEventListener('click', _setshowQrcode);
    };
  }, []);

  const getQrCode = async () => {
    setqrcode('');
    setshowQrcode(true);
  };

  return (
    <View className={styles.header}>
      {pageTitle && (
        <View className={styles.logoArea}>
          <View className={styles.name}>
            {typeList[pageType]} {'-'} {pageTitle}
          </View>
          <View
            className={styles.status}
            style={{ backgroundColor: isPublish ? 'rgb(135, 208, 104)' : '#ff4d4f' }}
          >
            {isPublish ? '已发布' : '未发布'}
          </View>
        </View>
      )}

      <View className={styles.controlArea}>
        <Button
          className={styles.inline}
          type='primary'
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
        >
          清空数据
        </Button>

        <Button className={styles.inline} type='primary' onClick={setPage}>
          页面设置
        </Button>

        <View className={styles.inlineButton}>
          <Button
            disabled
            className={styles.buttonDisabled}
            type='primary'
            onClick={(e) => toQrcode(e)}
          >
            预览
          </Button>

          {showQrcode ? (
            <View className={styles.qrcode}>
              <QRCode value={qrcode} />
            </View>
          ) : null}
        </View>

        <Button className={styles.inline} type='primary' onClick={save}>
          保存
        </Button>

        <Button className={styles.inline} type='primary' onClick={_publish}>
          发布
        </Button>
      </View>
    </View>
  );
});

export default Header;
