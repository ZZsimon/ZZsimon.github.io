import { View } from '@tarojs/components';
import React, { useContext, useEffect, useState } from 'react';

import templateList from '@/components/shopList/templateList';
import { getSchema } from '@/components/shopList/schema';
import DynamicEngine from '@/components/DynamicEngine';
import PageContext from '@/components/pageContext';

import TargetBox from './TargetBox';

import styles from './index.module.scss';

const Left = () => {
  const pageData = useContext(PageContext);
  const { pageInfo = {} } = pageData;

  const [leftList, setleftList] = useState([]);

  const getData = (template) => {
    const { type } = template;
    const schema = getSchema(type);

    const { config, editData } = schema;

    const templateData = {
      type,
      config
    };

    return {
      type,
      config,
      templateData,
      editData
    };
  };
  useEffect(() => {
    if (pageInfo) {
      // 不是支付页面的话去除支付组件
      let _templateList =
        pageInfo.pageScenes === 2 || pageInfo.pageScenes === 4
          ? templateList
          : templateList.filter((item) => item.type !== 'Pay');
      setleftList(_templateList);
    }
  }, [pageInfo]);

  return (
    <View className={styles.left}>
      <View className={styles.listWrap}>
        {leftList.map((template) => {
          const { templateData, type, config, editData } = getData(template);
          return (
            <TargetBox key={type} editData={editData} templateData={templateData}>
              <DynamicEngine type={type} config={config} isTpl />
            </TargetBox>
          );
        })}
      </View>
    </View>
  );
};

export default Left;
