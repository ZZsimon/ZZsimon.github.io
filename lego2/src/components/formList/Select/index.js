import React, { useState, useEffect, useContext } from 'react';
import { View } from '@tarojs/components';
import PageContext from '@/components/pageContext';
import { updateData } from '@/utils/updateData';

import styles from './index.module.scss';

const App = (props) => {
  const pageData = useContext(PageContext);
  const { curPointData, setcurPointData, pointData, updatePointData } = pageData;
  const { name, optionList } = props;

  const handleChange = (item) => {
    const { key } = item;

    updateData({
      value: key,
      curPointData,
      name,
      setcurPointData,
      pointData,
      updatePointData
    });
  };
  const [activeKey, setactiveKey] = useState('');

  const [showOptions, setshowOptions] = useState(false);

  const [activeValue, setaAtiveValue] = useState('');

  const toogleSelect = (e) => {
    e.stopPropagation();
    setshowOptions(!showOptions);
  };

  useEffect(() => {
    document.addEventListener('click', () => setshowOptions(false));
  }, []);

  const changeActiveKey = (item) => {
    setactiveKey(item.key);
    handleChange(item);
  };

  useEffect(() => {
    setactiveKey(curPointData.config[name]);
    setaAtiveValue(11);
    return () => {
      setactiveKey('');
    };
  }, [curPointData]);

  useEffect(() => {
    let _activeValue = '';
    optionList.forEach((item) => {
      if (item.key === curPointData.config[name]) {
        _activeValue = item.value;
      }
    });
    setaAtiveValue(_activeValue);
  }, [curPointData]);
  return (
    <View className={styles.selectWrapper}>
      <View onClick={toogleSelect} className={styles.selectInput}>
        {activeValue ? <View className={styles.activeOption}>{activeValue}</View> : null}

        <View className={`${styles.optionList} ${showOptions ? styles.active : ''}`}>
          {optionList.length > 0 &&
            optionList.map((item) => {
              return (
                <View
                  onClick={() => changeActiveKey(item)}
                  key={item.value}
                  className={`${styles.optionItem} ${
                    item.key === activeKey ? styles.optionItemAcitve : ''
                  } `}
                >
                  {item.value}
                </View>
              );
            })}
        </View>
      </View>
    </View>
  );
};

export default App;
