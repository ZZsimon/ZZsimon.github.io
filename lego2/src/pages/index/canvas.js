import React, { useRef, useMemo, useState, useContext } from 'react';
import { View } from '@tarojs/components';

import template from '@/components/shopList/templateList';
import PageContext from '@/components/pageContext';
import SourceBox from './SourceBox';

import styles from './index.module.scss';

const Canvas = () => {
  const containerRef = useRef(null);
  const pageData = useContext(PageContext);
  const { setcurPointData, contextMenuVisible, setcontextMenuVisible } = pageData;

  const maxWidth = 1000 - 375;
  const maxHeight = 800 - 667;

  const [diffmove, setDiffMove] = useState({
    x: 0,
    y: 0,
    move: false
  });
  const [dragState, setDragState] = useState({ x: 100, y: 100 });

  const mousedownfn = useMemo(
    () => (e) => {
      if (e.target === containerRef.current) {
        setDiffMove({
          x: e.clientX,
          y: e.clientY,
          move: true
        });
      }
    },
    []
  );

  const mousemovefn = useMemo(
    () => (e) => {
      if (diffmove.move) {
        const newX = e.clientX;
        const newY = e.clientY;
        const diffx = newX - diffmove.x;
        const diffy = newY - diffmove.y;
        setDiffMove({
          move: true,
          x: newX,
          y: newY
        });
        setDragState((prev) => ({
          x: getCanvasX(prev.x + diffx),
          y: getCanvasY(prev.y + diffy)
        }));
      }
    },
    [diffmove.move, diffmove.x, diffmove.y]
  );

  const mouseupfn = useMemo(
    () => () => {
      setDiffMove({
        move: false,
        x: 0,
        y: 0
      });
    },
    []
  );

  const getCanvasY = useMemo(
    () => (_y) => {
      let y = _y;
      if (y >= maxHeight) {
        y = maxHeight;
      } else if (y <= 0) {
        y = 0;
      }
      return y;
    },
    []
  );
  const getCanvasX = useMemo(
    () => (_x) => {
      let x = _x;
      if (x >= maxWidth) {
        x = maxWidth;
      } else if (x <= 0) {
        x = 0;
      }
      return x;
    },
    []
  );

  const allType = useMemo(() => {
    const arr = [];
    template.forEach((v) => {
      arr.push(v.type);
    });
    // 插入热区拖拽移动的类型
    // useDrop回调中需要对这个类型特殊处理
    return [...arr, 'HotZoneBox'];
  }, [template]);

  const handleClickMiddle = () => {
    if (contextMenuVisible) {
      setcontextMenuVisible(false);
      return;
    }
    setcurPointData(null);
  };

  const onContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <View
      ref={containerRef}
      // onMouseDown={mousedownfn}
      // onMouseMove={mousemovefn}
      // onMouseUp={mouseupfn}
      // onMouseLeave={mouseupfn}
      className={styles.canvasWrapper}
      onClick={handleClickMiddle}
      onContextMenu={onContextMenu}
    >
      <Grid />
      <SourceBox dragState={dragState} allType={allType} />
    </View>
  );
};

const Grid = () => {
  return (
    <svg className={styles.grid} width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'>
      <defs>
        <pattern
          id='smallGrid'
          width='7.236328125'
          height='7.236328125'
          patternUnits='userSpaceOnUse'
        >
          <path
            d='M 7.236328125 0 L 0 0 0 7.236328125'
            fill='none'
            stroke='rgba(207, 207, 207, 0.3)'
            strokeWidth='1'
          ></path>
        </pattern>
        <pattern id='grid' width='50' height='50' patternUnits='userSpaceOnUse'>
          <rect width='50' height='50' fill='url(#smallGrid)'></rect>
          <path
            d='M 50 0 L 0 0 0 50'
            fill='none'
            stroke='rgba(186, 186, 186, 0.5)'
            strokeWidth='1'
          ></path>
        </pattern>
      </defs>
      <rect width='100%' height='100%' fill='url(#grid)'></rect>
    </svg>
  );
};

export default Canvas;
