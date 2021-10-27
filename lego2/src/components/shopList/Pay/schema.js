import { baseDefault, baseConfig } from '../default_schema';

const Pay = {
  config: {
    ...baseDefault,
    title: '业务组件A',
    height: 667
  },
  editData: [...baseConfig]
};
export default Pay;
