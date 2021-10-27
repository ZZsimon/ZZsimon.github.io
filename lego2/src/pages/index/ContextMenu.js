import React, { memo, useContext } from 'react';
import { View } from '@tarojs/components';
import PageContext from '@/components/pageContext';
import styles from './index.module.scss';

const ContextMenu = memo(() => {
  const pageData = useContext(PageContext);
  const {
    contextMenuVisible,
    contextMenuPosition,
    deleteCurPointData,
    copyCurPointData
  } = pageData;
  const { top, left } = contextMenuPosition;

  const clickContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return contextMenuVisible ? (
    <View
      style={{
        top: `${top}px`,
        left: `${left}px`
      }}
      onClick={clickContextMenu}
      className={styles.menuList}
    >
      <View onClick={deleteCurPointData} className={styles.menuItem}>
        删除
      </View>
      <View onClick={copyCurPointData} className={styles.menuItem}>
        复制
      </View>
    </View>
  ) : null;
});

export default ContextMenu;
