import Taro, { getCurrentInstance } from '@tarojs/taro';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const isAdmin = window.location.href.indexOf('home') > -1;
const baseUrl = '/api';

export async function request(url, data, otherConfig = {}) {
  try {
    const frontToken = Taro.getStorageSync('front-token');
    const adminToken = Taro.getStorageSync('admin-token');
    const token = isAdmin ? adminToken : frontToken;

    const AK = isAdmin ? '' : 'c880564a58dc466081433a275325d2e6';

    let XMDeviceId = Taro.getStorageSync('XMDeviceId');
    if (!XMDeviceId) {
      XMDeviceId = uuidv4().replace(/-/g, '');
      Taro.setStorageSync('XMDeviceId', XMDeviceId);
    }
    const response = await axios({
      // 用axios发送post请求
      method: 'post',
      url: `${baseUrl}${url}`, // 请求地址
      data: data,
      headers: {
        'XM-AK': AK,
        'XM-Token': token,
        'XM-Device-Id': XMDeviceId,
        'X-Forwarded-Proto': 'https'
      },
      ...otherConfig
    });

    const res = response.data;
    if (res.code === 401) {
      const { router } = getCurrentInstance();
      const _path = router.path.replace(/&pageId=[0-9]*/, '');
      const path = _path.replace(/\?pageId=[0-9]*/, '');
      // 去除后用新路由刷新页面
      window.location.href = path;
      return;
    }
    return res;
  } catch (error) {
    Taro.showToast({
      title: '网络不佳 请稍后再试',
      icon: 'none',
      duration: 1000
    });
  }
}
