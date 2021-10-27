import { request } from '@/request';

export const getWxConfig = async ({
  wx,
  callback,
  url: _url,
  api = '/xinmai-order/wx-web-config'
}) => {
  if (process.env.NODE_ENV === 'development') {
    return;
  }
  const url = _url ? _url : window.location.href.split('#')[0];
  console.log(url, 'url');
  const res = await request(api, { url });
  if (res.success) {
    const config = res.data;
    const { appId, timestamp, nonceStr, signature } = config;
    const jsApiList = ['chooseWXPay', 'onMenuShareAppMessage', 'onMenuShareTimeline'];
    wx.config({
      debug: false,
      appId,
      timestamp,
      nonceStr,
      signature,
      jsApiList
    });

    wx.ready(() => {
      wx.onMenuShareAppMessage({
        title: document.title, // 分享标题
        link: url, // 分享链接
        desc: '新麦教育·沪江旗下·文学素养教育平台', // 分享描述
        imgUrl: 'https://resource.xinmai100.com/course/2020031115161769114181.png',
        success: function () {
          alert('分享朋友成功');
          console.log('分享朋友成功');
          callback();
        },
        fail: function (error) {
          alert('分享朋友失败');
          console.log(error, 'error 分享朋友失败');
        }
      });

      // wx.ready(function () {
      //   wx.updateTimelineShareData({
      //     title: document.title, // 分享标题
      //     link: window.location.href, // 分享链接
      //     desc: '新麦教育·沪江旗下·文学素养教育平台', // 分享描述
      //     imgUrl: 'https://resource.xinmai100.com/course/2020031115161769114181.png',
      //     success: function () {
      //       callback();
      //     },
      //     fail: function (error) {
      //       console.log(error, 'error 分享朋友圈失败');
      //     }
      //   });
      // });
    });
  }
};
