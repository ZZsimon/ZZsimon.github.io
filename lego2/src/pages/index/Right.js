import { View, Text } from '@tarojs/components';
import React, { useContext, useEffect, useState } from 'react';
import PageContext from '@/components/pageContext';

import Input from '@/components/formList/Input';
import Select from '@/components/formList/Select';
import Upload from '@/components/formList/Upload';
import DoubleInput from '@/components/formList/DoubleInput';
import ColorInput from '@/components/formList/ColorInput';

import styles from './index.module.scss';

const Right = () => {
  const pageData = useContext(PageContext);
  const { curPointData, editDataList } = pageData;
  return (
    <View className={styles.right}>
      <View className={styles.rightTitle}>属性设置</View>
      {curPointData ? (
        <View className={styles.rightContent}>
          {editDataList.length > 0 &&
            editDataList.map((item) => {
              return (
                <View key={item.key} className={styles.formItem}>
                  <Text className={styles.label}>{item.label}</Text>
                  {item.type === 'Input' && <Input name={item.key} type='text' />}
                  {item.type === 'Select' && (
                    <Select name={item.key} optionList={item.optionList} />
                  )}
                  {item.type === 'Upload' && <Upload name={item.key} />}
                  {item.type === 'DoubleInput' && (
                    <DoubleInput type='digit' name={item.key} valueList={item.valueList} />
                  )}
                  {item.type === 'ColorInput' && <ColorInput type='color' name={item.key} />}
                </View>
              );
            })}
        </View>
      ) : (
        <View className={styles.emptyEditData}>请选择组件 :)</View>
      )}
    </View>
  );
};

export default Right;
