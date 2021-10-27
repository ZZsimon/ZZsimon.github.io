import { baseDefault, baseConfig } from '../default_schema';

const Pay = {
  config: {
    ...baseDefault,
    title: '业务组件C',
    height: 290,
    helpPersonNum: 5,
    bgUrl: ''
  },
  editData: [
    ...baseConfig,
    {
      key: 'helpPersonNum',
      label: '助力人数',
      type: 'Input'
    },
    {
      key: 'bgUrl',
      label: '分享海报',
      type: 'Upload'
    }
  ]
};
export default Pay;
