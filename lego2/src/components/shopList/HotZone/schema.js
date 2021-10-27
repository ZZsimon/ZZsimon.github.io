import { baseDefault, baseConfig } from '../default_schema';

const HotZone = {
  config: {
    ...baseDefault,
    title: '热区组件',
    bgUrl: 'https://resource.xinmai100.com/authUser/2021032511351877284838.png',
    // height: 200,
    clickEvent: 0,
    areaSize: [
      { key: 'areaSizeWidth', label: '宽', value: 130 },
      { key: 'areaSizeHeight', label: '高', value: 90 }
    ],

    position: [
      { key: 'positionX', label: '左', value: 0 },
      { key: 'positionY', label: '上', value: 0 }
    ],
    position2: [
      { key: 'positionX', label: '左', value: 0 },
      { key: 'positionY', label: '下', value: 0 }
    ],
    isFloat: 0
  },
  editData: [
    ...baseConfig,
    {
      key: 'clickEvent',
      label: '点击事件',
      type: 'Select',
      optionList: [
        { value: '无跳转', key: 0 },
        { value: '跳转h5页面', key: 1 },
        { value: '某个业务功能：）', key: 3 },
        { value: '组队助力', key: 4 }
      ]
    },
    {
      key: 'isFloat',
      label: '是否悬浮',
      type: 'Select',
      optionList: [
        { value: '是', key: 1 },
        { value: '否', key: 0 }
      ]
    },
    {
      key: 'areaSize',
      label: '热区大小',
      type: 'DoubleInput',
      valueList: [
        {
          key: 'areaSizeWidth',
          label: '宽',
          value: 0
        },
        {
          key: 'areaSizeHeight',
          label: '高',
          value: 0
        }
      ]
    }
  ]
};
export default HotZone;
