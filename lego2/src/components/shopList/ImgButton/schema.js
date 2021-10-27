import { baseDefault, baseConfig } from '../default_schema';

const ImgButton = {
  config: {
    ...baseDefault,
    title: '图片组件',
    bgUrl: 'https://resource.xinmai100.com/authUser/2021032511351877284838.png',
    height: 200,
    clickEvent: 0,
    applyNote: 1
  },
  editData: [
    ...baseConfig,
    {
      key: 'bgUrl',
      label: '背景图片',
      type: 'Upload'
    },
    {
      key: 'clickEvent',
      label: '点击事件',
      type: 'Select',
      optionList: [
        { value: '无跳转', key: 0 },
        { value: '跳转h5页面', key: 1 },
        // { value: '页面锚点', key: 2 },
        { value: '某个业务功能：）', key: 3 }
        // { value: '授权请求', key: 4 },
        // { value: '客服会话', key: 5 }
      ]
    }
  ]
};
export default ImgButton;
