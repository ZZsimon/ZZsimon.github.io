import React, { useMemo, useContext } from 'react';
import { useDrag } from 'react-dnd';
import { View } from '@tarojs/components';

const HotZone = ({
  id,
  handleClickTemplate,
  handleContextMenu,
  style,
  children,
  className
}) => {
  const [, drag] = useDrag(() => {
    return {
      item: { type: 'HotZoneBox', id: id }
    };
  }, []);

  return (
    <View
      className={className}
      ref={drag}
      onClick={handleClickTemplate}
      onContextMenu={handleContextMenu}
      style={style}
    >
      {children}
    </View>
  );
};

export default HotZone;
