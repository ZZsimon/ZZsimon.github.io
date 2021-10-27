import { baseDefault, baseConfig } from '../default_schema';

const ImgButton = {
  config: {
    ...baseDefault,
    title: '业务组件B',
    bgUrl: 'https://resource.xinmai100.com/JKMarket/img/children/qrcodebg1.jpg?imageslim',
    height: 667,

    bgColor: 'rgb(223, 245, 197)',
    marginTop: 322,
    codeSize: [
      { key: 'codeSizeWidth', label: '宽', value: 206 },
      { key: 'codeSizeHeight', label: '高', value: 206 }
    ],
    ifShowWX: 0,
    fontColor: 'red'
  },
  editData: [
    ...baseConfig,
    {
      key: 'bgUrl',
      label: '背景图片',
      type: 'Upload'
    },
    {
      key: 'bgColor',
      label: '背景颜色',
      type: 'ColorInput'
    },
    {
      key: 'codeSize',
      label: '尺寸',
      type: 'DoubleInput',
      valueList: [
        {
          key: 'codeSizeWidth',
          label: '宽',
          value: 0
        },
        {
          key: 'codeSizeHeight',
          label: '高',
          value: 0
        }
      ]
    },
    {
      key: 'marginTop',
      label: '距离顶部距离',
      type: 'Input'
    },
    {
      key: 'ifShowWX',
      label: '微信号是否显示',
      type: 'Select',
      optionList: [
        { value: '否', key: 0 },
        { value: '是', key: 1 }
      ]
    },
    {
      key: 'fontColor',
      label: '字体颜色',
      type: 'ColorInput'
    }
  ]
};
export default ImgButton;
