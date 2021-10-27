import { View } from '@tarojs/components';
import React, { useContext } from 'react';
import PageContext from '@/components/pageContext';

import Canvas from './canvas';
import PageList from './pageList';

import styles from './index.module.scss';

const Middle = () => {
  const pageData = useContext(PageContext);
  const { pageInfo, currentPage } = pageData;
  return (
    <View className={styles.middle}>
      {pageInfo && currentPage && <PageList />}
      <Canvas />
    </View>
  );
};

export default Middle;
