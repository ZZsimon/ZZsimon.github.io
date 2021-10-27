import { baseDefault, baseConfig } from '../default_schema';

const Broadcast = {
  config: {
    ...baseDefault,
    title: '消息通知',
    width: 190,
    height: 26,
    layout: 'right',
    fontColor: '#fff',
    bgUrl: 'https://resource.xinmai100.com/authUser/2021060214564945581011.png'
  },
  editData: [
    ...baseConfig,
    {
      key: 'bgUrl',
      label: '背景图片',
      type: 'Upload'
    },
    {
      key: 'layout',
      label: '布局排列',
      type: 'Select',
      optionList: [
        { value: '左侧', key: 'left' },
        { value: '右侧', key: 'right' }
      ]
    },
    { key: 'fontColor', label: '字体颜色', type: 'ColorInput' }
  ]
};
export default Broadcast;
