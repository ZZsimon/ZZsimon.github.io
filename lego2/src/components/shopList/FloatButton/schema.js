import { baseDefault, baseConfig } from '../default_schema';

const FloatButton = {
  config: {
    ...baseDefault,
    title: '底部悬浮组件',
    bgUrl: 'https://resource.xinmai100.com/authUser/2021032511292724862370.png',
    height: 135,
    clickEvent: 0,
    smsCode: 2,
    floatType: 1,
    areaSize: [
      { key: 'areaSizeWidth', label: '宽', value: 100 },
      { key: 'areaSizeHeight', label: '高', value: 40 }
    ],

    position: [
      { key: 'positionX', label: '左', value: 0 },
      { key: 'positionY', label: '上', value: 0 }
    ],
    initNumber: 300,
    fontColor: 'red'
  },
  editData: [
    ...baseConfig,
    {
      key: 'floatType',
      label: '类型',
      type: 'Select',
      optionList: [
        { value: '例子报名', key: 1 },
        { value: '常规', key: 0 }
      ]
    },
    {
      key: 'bgUrl',
      label: '背景图片',
      type: 'Upload'
    }
  ]
};
export default FloatButton;
