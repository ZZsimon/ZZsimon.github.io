import React, { useState, useContext, useEffect } from 'react';
import { View, Input } from '@tarojs/components';
import PageContext from '@/components/pageContext';
import { updateData } from '@/utils/updateData';

import styles from './index.module.scss';

const App = (props) => {
  const pageData = useContext(PageContext);
  const { curPointData, setcurPointData, pointData, updatePointData } = pageData;
  const { name, type } = props;
  const [inputValue, setinputValue] = useState('');

  useEffect(() => {
    setinputValue(curPointData.config[name]);
    return () => {
      setinputValue('');
    };
  }, [curPointData]);

  const handleChange = (e) => {
    const value = e.target.value;
    setinputValue(value);
    updateData({
      value,
      curPointData,
      name,
      setcurPointData,
      pointData,
      updatePointData
    });
  };
  return (
    <View className={styles.inputWrapper}>
      <Input value={inputValue} name={name} onInput={handleChange} type={type} />
    </View>
  );
};

export default App;
