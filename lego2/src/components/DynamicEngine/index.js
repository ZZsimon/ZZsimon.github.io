import React, { useState, useEffect, useContext } from 'react';
import ImgButton from '@/components/shopList/ImgButton';
import FloatButton from '@/components/shopList/FloatButton';
import Pay from '@/components/shopList/Pay';
import ScanCode from '@/components/shopList/ScanCode';
import HotZone from '@/components/shopList/HotZone';
import Broadcast from '@/components/shopList/Broadcast';
import TeamUp from '@/components/shopList/TeamUp';

const DynamicEngine = (props) => {
  const { type, config, isTpl, canDrag } = props;
  let Component;
  switch (type) {
    case 'ImgButton':
      Component = ImgButton;
      break;
    case 'FloatButton':
      Component = FloatButton;
      break;
    case 'Pay':
      Component = Pay;
      break;
    case 'ScanCode':
      Component = ScanCode;
      break;
    case 'HotZone':
      Component = HotZone;
      break;
    case 'Broadcast':
      Component = Broadcast;
      break;
    case 'TeamUp':
      Component = TeamUp;
      break;
    default:
      break;
  }
  return <Component canDrag={canDrag} {...config} isTpl={isTpl} />;
};

export default DynamicEngine;
