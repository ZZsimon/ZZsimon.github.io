import React, { useState, useContext, useEffect } from 'react';
import { View, Input, Text } from '@tarojs/components';
import PageContext from '@/components/pageContext';
import { updateData } from '@/utils/updateData';
import styles from './index.module.scss';

const App = (props) => {
  const pageData = useContext(PageContext);

  const { curPointData, setcurPointData, pointData, updatePointData } = pageData;
  const [dbInputValue, setdbInputValue] = useState([]);
  const { type, name } = props;

  useEffect(() => {
    setdbInputValue(curPointData.config[name]);
    return () => {
      setdbInputValue([]);
    };
  }, [curPointData]);

  const handleChange = (index, e) => {
    const value = e.target.value;
    const _dbInputValue =
      index === 0
        ? [{ ...dbInputValue[index], value: value }, dbInputValue[1]]
        : [dbInputValue[0], { ...dbInputValue[index], value: value }];

    setdbInputValue(_dbInputValue);

    updateData({
      value: _dbInputValue,
      curPointData,
      name,
      setcurPointData,
      pointData,
      updatePointData
    });
  };
  return (
    <View className={styles.inputWrapper}>
      {dbInputValue.length > 0 && (
        <>
          <View className={styles.dbInput}>
            <Input
              value={dbInputValue[0].value}
              onInput={(e) => handleChange(0, e)}
              type={type}
            />
            <Text className={styles.title}>{dbInputValue[0].label}</Text>
          </View>
          <View className={styles.dbInput}>
            <Input
              value={dbInputValue[1].value}
              onInput={(e) => handleChange(1, e)}
              type={type}
              min={0}
            />
            <Text className={styles.title}>{dbInputValue[1].label}</Text>
          </View>
        </>
      )}
    </View>
  );
};

export default App;
