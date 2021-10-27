import React, { useMemo, useContext, useEffect } from 'react';
import Taro from '@tarojs/taro';
import uuid from 'uuid/v4';
import { useDrop } from 'react-dnd';
import { View } from '@tarojs/components';

import { updateData } from '@/utils/updateData';

import ViewRender from '@/components/ViewRender';
import PageContext from '@/components/pageContext';
import ContextMenu from './ContextMenu';

import styles from './index.module.scss';

const SourceBox = (props) => {
  const basePointDataScrollWrapper = document.getElementById('basePointDataScrollWrapper');
  const { allType, dragState } = props;
  const pageData = useContext(PageContext);
  const {
    pointData,
    addPointData,
    curPointData,
    setcurPointData,
    updatePointData,
    setcontextMenuVisible
  } = pageData;

  const [{ isOver }, drop] = useDrop({
    accept: allType,
    drop: (item, monitor) => {
      if (item.type === 'HotZoneBox') {
        _addHotZoneData(monitor);
        return;
      }

      const { editData, templateData } = item;
      const { type, config } = templateData;
      // 拖入非悬浮热区组件前 需要拖入图片组件
      const _basePointData = pointData.filter(
        (point) => point.type !== 'FloatButton' && point.type !== 'HotZone'
      );
      if (_basePointData.length === 0 && config.isFloat === 0) {
        alert('请先拖入图片组件');
        return;
      }

      // 修改第一次拖入热区组件的位置
      let _config = config;
      if (item.type === 'HotZone') {
        const list = _addHotZoneData(monitor, templateData);
        // config.position = [...list];
        _config = {
          ...config,
          position: list
        };
      }

      const id = uuid();
      const y = getInitY(monitor);
      const newPoint = {
        type,
        config: _config,
        i: id,
        x: 0,
        y,
        w: 24, // 1表示1/24 24相当于width:100%
        h: config.height,
        isBounded: true,
        isResizable: false,
        editData
      };
      addPointData(newPoint);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  });

  const _addHotZoneData = (monitor, templateData) => {
    const monitorType = monitor.getItem().type;
    if (monitorType === 'HotZoneBox' || monitorType === 'HotZone') {
      const curDragdata =
        monitorType === 'HotZoneBox'
          ? pointData.filter((item) => {
              return item.i === monitor.getItem().id;
            })[0]
          : templateData;

      const { isFloat } = curDragdata.config;
      const list = getHotBoxPositon({
        monitor,
        curDragdata,
        monitorType,
        isFloat: isFloat === 1
      });
      if (monitorType === 'HotZone') {
        return list;
      }
      updateData({
        value: list,
        curPointData: curDragdata,
        name: isFloat === 1 ? 'position2' : 'position',
        setcurPointData,
        pointData,
        updatePointData
      });
      setcontextMenuVisible(false);
    } else {
      Taro.showToast({
        title: '请拖动热区组件',
        icon: 'none',
        duration: 1000
      });
    }
  };

  const getHotBoxPositon = ({ monitor, curDragdata, monitorType, isFloat }) => {
    const position = isFloat ? curDragdata.config.position2 : curDragdata.config.position;
    const _dbInputValue = [...position];
    const getDifferenceFromInitialOffsetX =
      monitorType === 'HotZoneBox' ? monitor.getDifferenceFromInitialOffset().x : 0;
    const _left = _dbInputValue[0].value + getDifferenceFromInitialOffsetX;
    const maxLeft = 375 - curDragdata.config.areaSize[0].value;
    const left = _left < 0 ? 0 : _left > maxLeft ? maxLeft : _left;

    const scrollY = getScrollY();
    const getDifferenceFromInitialOffsetY =
      monitorType === 'HotZoneBox' ? monitor.getDifferenceFromInitialOffset().y : scrollY;
    const _top = _dbInputValue[1].value + getDifferenceFromInitialOffsetY;
    const _bottom = _dbInputValue[1].value + -getDifferenceFromInitialOffsetY;

    const containerClient =
      curDragdata.config.isFloat === 1 ? 667 : basePointDataScrollWrapper.clientHeight;
    const maxTop = containerClient - curDragdata.config.areaSize[1].value;
    const top = _top < 0 ? 0 : _top > maxTop ? maxTop : _top;
    const bottom = _bottom < 0 ? 0 : _bottom > maxTop ? maxTop : _bottom;

    const list = [
      { ...position[0], value: left },
      { ...position[1], value: isFloat ? bottom : top }
    ];
    return list;
  };

  const getInitY = (monitor) => {
    const parentDiv = document.getElementById('canvasWrapper');
    const pointRect = parentDiv.getBoundingClientRect();
    const top = pointRect.top;
    const pointEnd = monitor.getSourceClientOffset();
    const y = pointEnd.y < top ? 0 : pointEnd.y - top;
    const scrollY = getScrollY();
    return y + scrollY;
  };

  const getScrollY = () => {
    const basePointDataWrapper = document.getElementById('basePointDataWrapper');
    if (!basePointDataWrapper) {
      return 0;
    }
    const scrollTop = basePointDataWrapper.scrollTop;
    return scrollTop;
  };

  const opacity = isOver ? 0.7 : 1;
  const render = useMemo(
    () => (
      <View
        style={{
          transform: `translate(${dragState.x}px,${dragState.y}px)`
        }}
        className={styles.canvasBox}
      >
        <View id='canvasWrapper' className={styles.canvas} style={{ opacity }} ref={drop}>
          {pointData.length > 0 ? <ViewRender canDrag pointData={pointData} /> : null}
          <ContextMenu />
        </View>
      </View>
    ),
    [dragState, drop, opacity, pointData]
  );

  return render;
};

export default SourceBox;
