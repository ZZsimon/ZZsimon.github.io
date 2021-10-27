import React, { useState } from 'react';
import Taro, { useRouter } from '@tarojs/taro';
import { View, Text, Button, Input } from '@tarojs/components';

import { v4 as uuidv4 } from 'uuid';

import styles from './index.module.scss';

const typeList = [
  { value: 1, text: 'H5' }
  // { value: 2, text: '小程序（暂不支持）' }
];
const scenesList = [
  { value: 1, text: '场景1' },
  { value: 2, text: '场景2' },
  { value: 4, text: '场景3' },
  { value: 3, text: '场景4' }
];

const PageModal = ({ pageInfo, setvisible }) => {
  const router = useRouter();
  const { topicId = '' } = router.params;

  const _pageInfo = pageInfo ? pageInfo : {};
  const { pageTitle, pageSubTitle, pageType, pageScenes } = _pageInfo;
  const [pageTitleValue, setpageTitleValue] = useState(pageTitle);
  const [pageSubTitleValue, setpageSubTitleValue] = useState(pageSubTitle);
  const [pageTypeValue, setpageTypeValue] = useState(pageType || 1);
  const [pageScenesValue, setpageScenesValue] = useState(pageScenes);

  const changePageTitle = (e) => {
    const value = e.target.value;
    setpageTitleValue(value);
  };
  const changePageSubTitle = (e) => {
    const value = e.target.value;
    setpageSubTitleValue(value);
  };

  const setTopicPage = async () => {
    const res = {
      data: {
        pageTitle: pageTitleValue,
        topicName: pageSubTitleValue,
        topicType: pageTypeValue,
        applicationScenarios: pageScenesValue,
        elements: [],
        isPublish: 0,
        topicId: uuidv4().replace(/-/g, '')
      }
    };
    localStorage.removeItem('topicDetailData');
    localStorage.setItem('topicDetailData', JSON.stringify(res));

    Taro.redirectTo({
      url: `/home?topicId=${res.data.topicId}`
    });
  };

  return (
    <View>
      <View className={styles.modalWrap}>
        <View className={styles.content}>
          <View className={styles.title}>页面设置</View>

          <View className={styles.modalFormItem}>
            <Text className={styles.label}>页面标题</Text>
            <Input
              maxlength={20}
              placeholder='页面打开时的顶部标题'
              value={pageTitleValue}
              onInput={changePageTitle}
              type='text'
            />
          </View>
          <View className={styles.modalFormItem}>
            <Text className={styles.label}>样式标题</Text>
            <Input
              maxlength={57}
              placeholder='用于区分页面用途'
              value={pageSubTitleValue}
              onInput={changePageSubTitle}
              type='text'
            />
          </View>
          <View className={styles.modalFormItem}>
            <Text className={styles.label}>应用平台</Text>
            <View className={styles.radioWrapper}>
              {typeList.map((item) => {
                return (
                  <View
                    className={styles.radio}
                    style={{
                      backgroundColor: item.value === pageTypeValue ? '#00a9ff' : '',
                      color: item.value === pageTypeValue ? '#fff' : '',
                      pointerEvents: pageTitle || item.value === 2 ? 'none' : 'auto',
                      opacity: pageTitle || item.value === 2 ? '0.5' : '1'
                    }}
                    onClick={() => {
                      if (item.value === pageTypeValue) {
                        return;
                      }
                      setpageTypeValue(item.value);
                    }}
                    key={item.value}
                    value={item.value}
                  >
                    {item.text}
                  </View>
                );
              })}
            </View>
          </View>
          <View className={styles.modalFormItem}>
            <Text className={styles.label}>应用场景</Text>
            <View className={styles.radioWrapper}>
              {scenesList.map((item) => {
                return (
                  <View
                    className={styles.radio}
                    style={{
                      backgroundColor: pageScenesValue === item.value ? '#00a9ff' : '',
                      color: pageScenesValue === item.value ? '#fff' : '',
                      pointerEvents: pageTitle ? 'none' : 'auto',
                      opacity: pageTitle ? '0.5' : '1'
                    }}
                    onClick={() => {
                      if (item.value === pageScenesValue) {
                        return;
                      }
                      setpageScenesValue(item.value);
                    }}
                    key={item.value}
                    value={item.value}
                  >
                    {item.text}
                  </View>
                );
              })}
            </View>
          </View>

          <View className={styles.footer}>
            {pageTitle ? (
              <Button onClick={() => setvisible(false)} className={styles.inline}>
                取消
              </Button>
            ) : null}

            <Button
              onClick={setTopicPage}
              type='primary'
              className={`${styles.inline} ${styles.inline2}`}
            >
              确定
            </Button>
          </View>
        </View>
      </View>
      <View className={styles.mask} />
    </View>
  );
};

export default PageModal;
