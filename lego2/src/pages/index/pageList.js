import React, { useContext } from 'react';
import { View } from '@tarojs/components';
import PageContext from '@/components/pageContext';

import styles from './index.module.scss';

const PageList = () => {
  const pageData = useContext(PageContext);
  const { pageInfo, currentPage, changePage } = pageData;
  const { pageList = [] } = pageInfo;
  return (
    <View className={styles.pageList}>
      {pageList.map((item) => {
        return (
          <View
            key={item.pageId}
            onClick={() => changePage(item)}
            className={`${styles.pageListItem} ${item.pageId === currentPage.pageId ? styles.active : ''
              }`}
          >
            <View title={item.title} className={styles.title}>
              {item.title}
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default PageList;
