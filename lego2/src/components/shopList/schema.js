import ImgButton from './ImgButton/schema';
import FloatButton from './FloatButton/schema';
import Pay from './Pay/schema';
import ScanCode from './ScanCode/schema';
import HotZone from './HotZone/schema';
import Broadcast from './Broadcast/schema';
import TeamUp from './TeamUp/schema';

const schema = {
  ImgButton,
  FloatButton,
  Pay,
  ScanCode,
  HotZone,
  Broadcast,
  TeamUp
};

export const getSchema = (type) => {
  return schema[type];
};
