import React, { useState, useEffect, useContext } from 'react';
import Taro from '@tarojs/taro';
import { request } from '@/request';
import { View, Image } from '@tarojs/components';
import PageContext from '@/components/pageContext';
import { updateData } from '@/utils/updateData';
import styles from './index.module.scss';

const App = (props) => {
  const pageData = useContext(PageContext);
  const { curPointData, setcurPointData, pointData, updatePointData } = pageData;
  const { name } = props;
  const handleChange = (value) => {
    const width =
      curPointData.type === 'Broadcast' || curPointData.type === 'TeamUp'
        ? value.width
        : '100%';

    let _name = ['width', 'height', name];
    if (curPointData.type === 'TeamUp') {
      _name = ['bgWidth', 'bgHeight', name];
    }
    updateData({
      value: [width, value.height, value.bgUrl],
      curPointData,
      name: _name,
      setcurPointData,
      pointData,
      updatePointData
    });
  };

  const [imgUrl, setimgUrl] = useState('');

  const upload = () => {
    Taro.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有，在H5浏览器端支持使用 `user` 和 `environment`分别指定为前后摄像头
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths[0];
        setimgUrl(tempFilePaths);
        getUrl(tempFilePaths);
      }
    });
  };

  const getUrl = async (tempFilePaths) => {
    const res = await request('/xinmai-admin-order/taka-token', { bizType: 'authUser' });
    uploadFile(tempFilePaths, res);
  };

  const uploadFile = async (tempFilePaths, response) => {
    Taro.uploadFile({
      url: `${response.data.uploadDomain}/v1/file`,
      filePath: tempFilePaths,
      name: 'file',
      formData: {
        isFullWrite: 1,
        customFilePath: response.data.customFilePath + '.png'
      },
      header: {
        token: response.data.token
      },
      success(res) {
        const data = JSON.parse(res.data);
        const width = data.data[0].metadata.width / 2;
        const height = data.data[0].metadata.height / 2;
        const bgUrl = data.data[0].publishUrl;
        const value = { width, height, bgUrl };
        handleChange(value);
      }
    });
  };

  useEffect(() => {
    setimgUrl(curPointData.config[name]);
    return () => {
      setimgUrl('');
    };
  }, [curPointData]);

  return (
    <View onClick={upload} className={styles.upload}>
      <Image className={styles.imgUrl} src={imgUrl} />
    </View>
  );
};

export default App;
