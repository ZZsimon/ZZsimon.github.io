import React, { useState, useContext, useEffect } from 'react';
import { SketchPicker } from 'react-color';
import { View } from '@tarojs/components';
import PageContext from '@/components/pageContext';
import { updateData } from '@/utils/updateData';

import styles from './index.module.scss';

const App = (props) => {
  const pageData = useContext(PageContext);
  const { curPointData, setcurPointData, pointData, updatePointData } = pageData;
  const { name, type } = props;
  const [inputValue, setinputValue] = useState('');

  const [displayColorPicker, setdisplayColorPicker] = useState(false);

  useEffect(() => {
    setinputValue(curPointData.config[name]);
    return () => {
      setinputValue('');
    };
  }, [curPointData]);

  const handleChange = (e) => {
    const value = e.hex;
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
      <View className={styles.target} onClick={() => setdisplayColorPicker(true)}>
        <View
          className={styles.targetInput}
          style={{
            backgroundColor: inputValue
          }}
        />
      </View>
      {displayColorPicker ? (
        <View className={styles.popover}>
          <View className={styles.cover} onClick={() => setdisplayColorPicker(false)} />
          <SketchPicker color={inputValue} onChange={handleChange} />
        </View>
      ) : null}
    </View>
  );
};

export default App;
