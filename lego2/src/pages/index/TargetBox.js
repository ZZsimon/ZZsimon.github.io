import React, { useMemo, memo } from 'react';
import { View } from '@tarojs/components';
import { useDrag } from 'react-dnd';

import styles from './index.module.scss';

const TargetBox = memo((props) => {
  // 获取组件的配置项
  const { children, templateData, editData } = props;
  const [{ isDragging }, drag] = useDrag({
    item: {
      type: templateData.type,
      templateData,
      editData: editData
    },
    collect: (monitor) => ({ isDragging: monitor.isDragging() })
  });

  const containerStyle = useMemo(() => ({ opacity: isDragging ? 0.4 : 1 }), [isDragging]);
  return (
    <View className={styles.listItem} style={{ ...containerStyle }} ref={drag}>
      {children}
    </View>
  );
});

export default TargetBox;
