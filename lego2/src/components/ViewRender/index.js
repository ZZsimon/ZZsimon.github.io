import React, { useContext, useEffect, useState } from 'react';
import RGL, { WidthProvider } from 'react-grid-layout';

import { View } from '@tarojs/components';

import DynamicEngine from '@/components/DynamicEngine';
import PageContext from '@/components/pageContext';
import { getPointData } from '@/utils/getPointData';
import { getElementSize } from '@/utils/getElementSize';

import HotZone from './renderHotZone';

import styles from './viewRender.module.scss';

const ReactGridLayout = WidthProvider(RGL);

const ViewRender = ({ pointData, canDrag }) => {
  const pageData = useContext(PageContext);
  const {
    updatePointData,
    setcurPointData,
    curPointData,
    contextMenuVisible,
    setcontextMenuVisible,
    setcontextMenuPosition
  } = pageData;

  const [isPcClient, setisPcClient] = useState(false);
  const onLayoutChange = (layout) => {
    if (!canDrag) {
      return;
    }
    const _pointData = getPointData(pointData, layout, canDrag);
    updatePointData(_pointData);
  };

  const handleClickTemplate = (value, e) => {
    if (!canDrag) {
      return;
    }
    setcontextMenuVisible(false);
    e.preventDefault();
    e.stopPropagation();
    setcurPointData(value);
  };

  useEffect(() => {
    if (canDrag) {
      document.addEventListener('click', () => {
        setcontextMenuVisible(false);
      });
    }
    const isPc = document.body.clientWidth > 1200;
    setisPcClient(isPc);
  }, []);

  const [basePointData, setbasePointData] = useState([]);
  const [floatPointData, setfloatPointData] = useState([]);
  const [hotZonePointData, sethotZonePointData] = useState([]);
  const [hotZoneFloatPointData, sethotZoneFloatPointData] = useState([]);
  const [broadcastPointData, setbroadcastPointData] = useState([]);
  useEffect(() => {
    const __pointData = [...pointData];
    const _floatPointData = __pointData.filter((item) => item.type === 'FloatButton');
    const _basePointData = __pointData.filter(
      (item) =>
        item.type !== 'FloatButton' && item.type !== 'HotZone' && item.type !== 'Broadcast'
    );
    const _hotZonePointData = __pointData.filter(
      (item) => item.type === 'HotZone' && item.config.isFloat === 0
    );
    const _hotZoneFloatPointData = __pointData.filter(
      (item) => item.type === 'HotZone' && item.config.isFloat === 1
    );
    const _broadcastPointData = __pointData.filter((item) => item.type === 'Broadcast');
    setfloatPointData(_floatPointData);
    setbasePointData(_basePointData);
    sethotZonePointData(_hotZonePointData);
    sethotZoneFloatPointData(_hotZoneFloatPointData);
    setbroadcastPointData(_broadcastPointData);
  }, [pointData]);

  const onContextMenu = (value, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!canDrag || !curPointData) {
      return;
    }
    if (curPointData.i !== value.i) {
      return;
    }
    const left = getpositionLeft(value, e);
    const top = getpositionTop(value, e);

    setcontextMenuVisible(true);
    setcontextMenuPosition({
      left,
      top
    });
  };

  const onWheel = () => {
    if (contextMenuVisible) {
      setcontextMenuVisible(false);
    }
  };

  const getpositionLeft = (value, e) => {
    // 热区不使用RGL,不会使用transform来做偏移
    // 会使用position来做偏移,因此拿position的left值
    if (value.type === 'HotZone') {
      const { config } = value;
      const { position } = config;
      return +position[0].value + e.offsetX;
    }
    if (value.type === 'Broadcast') {
      const { config } = value;
      const { width, layout } = config;
      const _left = layout === 'left' ? 0 : 375 - +width;
      return _left + e.offsetX;
    }
    return e.offsetX;
  };

  const getpositionTop = (value, e) => {
    const transformY = +getTransformY(value, e.target)[1];
    const floatY = getFloatY(value, transformY);
    const scrollY = getScrollY(value);
    let top = e.offsetY + transformY + floatY - scrollY;
    return top;
  };

  const getTransformY = (value, box) => {
    // 热区不使用RGL,不会使用transform来做偏移
    // 会使用position来定位,因此拿position的top值
    if (value.type === 'HotZone') {
      const { config } = value;
      const { position } = config;
      return [0, position[1].value];
    }
    // 消息通知距离顶部距离固定80
    if (value.type === 'Broadcast') {
      return [0, 40];
    }

    const transformStyle = box.style.transform || box.style.webkitTransform;
    var reg = /(\d)+(px)/gi;
    let newStr = transformStyle.replace(reg, (_value) => {
      _value = _value.replace(/px/i, '');
      return _value;
    });
    const result = newStr.match(/\d+/g);
    return result;
  };

  const getFloatY = (value) => {
    if (value.type !== 'FloatButton') {
      return 0;
    }
    const floatPointDataWrapper = document.getElementById('floatPointDataWrapper');
    const height = floatPointDataWrapper.offsetHeight;
    return 667 - height;
  };

  const getScrollY = (value) => {
    if (value.type === 'FloatButton') {
      return 0;
    }
    if (value.type === 'HotZone' && value.config.isFloat === 1) {
      return 0;
    }
    const basePointDataWrapper = document.getElementById('basePointDataWrapper');
    const scrollTop = basePointDataWrapper.scrollTop;

    return scrollTop;
  };

  return (
    <>
      {basePointData.length > 0 && (
        <View
          onWheel={onWheel}
          id='basePointDataWrapper'
          style={{
            height: isPcClient ? '667px' : '100vh',
            overflowY: isPcClient ? 'auto' : '',
            overflowX: 'hidden'
          }}
          className={styles.basePointDataWrapper}
        >
          <View id='basePointDataScrollWrapper' style={{ position: 'relative' }}>
            {canDrag ? (
              <ReactGridLayout
                cols={24}
                rowHeight={1}
                layout={basePointData}
                margin={[0, 0]}
                className={styles.layout}
                onLayoutChange={onLayoutChange}
                style={{ width: '100%' }}
              >
                {basePointData.map((value) => {
                  const { type, config, i } = value;
                  return (
                    <View
                      key={i}
                      className={`
                    ${canDrag ? styles.dragItem : ''}
                  `}
                      onClick={(e) => {
                        handleClickTemplate(value, e);
                      }}
                      onContextMenu={(e) => {
                        onContextMenu(value, e);
                      }}
                      style={{
                        left: '0',
                        top: '0'
                      }}
                    >
                      {curPointData && curPointData.i === i ? (
                        <View className={styles.dragItemChild}></View>
                      ) : null}
                      <DynamicEngine canDrag={canDrag} type={type} config={config} />
                    </View>
                  );
                })}
              </ReactGridLayout>
            ) : (
              basePointData.map((value) => {
                const { type, config, i } = value;
                return (
                  <View
                    key={i}
                    className={`
                  ${canDrag ? styles.dragItem : ''}
                `}
                    onClick={(e) => {
                      handleClickTemplate(value, e);
                    }}
                    onContextMenu={(e) => {
                      onContextMenu(value, e);
                    }}
                    style={{
                      left: '0',
                      top: '0'
                    }}
                  >
                    {curPointData && curPointData.i === i ? (
                      <View className={styles.dragItemChild}></View>
                    ) : null}
                    <DynamicEngine canDrag={canDrag} type={type} config={config} />
                  </View>
                );
              })
            )}

            {canDrag
              ? hotZonePointData.length > 0 &&
                hotZonePointData.map((value) => {
                  const { type, config, i } = value;
                  const { position } = config;

                  return (
                    <HotZone
                      key={i}
                      handleClickTemplate={(e) => {
                        handleClickTemplate(value, e);
                      }}
                      handleContextMenu={(e) => {
                        onContextMenu(value, e);
                      }}
                      id={i}
                      className={styles.dragItemHotZone}
                      style={{
                        position: 'absolute',
                        left: getElementSize(canDrag, position[0].value),
                        top: getElementSize(canDrag, position[1].value),
                        zIndex: '91'
                      }}
                    >
                      {curPointData && curPointData.i === i ? (
                        <View className={styles.dragItemHotZoneChild}></View>
                      ) : null}
                      <DynamicEngine canDrag={canDrag} type={type} config={config} />
                    </HotZone>
                  );
                })
              : hotZonePointData.length > 0 &&
                hotZonePointData.map((value) => {
                  const { type, config, i } = value;
                  const { position } = config;

                  return (
                    <View
                      key={i}
                      onClick={(e) => {
                        handleClickTemplate(value, e);
                      }}
                      handleContextMenu={(e) => {
                        onContextMenu(value, e);
                      }}
                      id={i}
                      className={styles.dragItemHotZone}
                      style={{
                        position: 'absolute',
                        left: getElementSize(canDrag, position[0].value),
                        top: getElementSize(canDrag, position[1].value),
                        zIndex: '91'
                      }}
                    >
                      <DynamicEngine canDrag={canDrag} type={type} config={config} />
                    </View>
                  );
                })}

            {broadcastPointData.length > 0 &&
              broadcastPointData.map((value) => {
                const { type, config, i } = value;
                const { layout } = config;
                return (
                  <View
                    key={i}
                    onClick={(e) => {
                      handleClickTemplate(value, e);
                    }}
                    onContextMenu={(e) => {
                      onContextMenu(value, e);
                    }}
                    id={i}
                    className={styles.dragItem}
                    style={{
                      position: 'absolute',
                      left: layout === 'left' ? 0 : 'auto',
                      right: layout === 'right' ? 0 : 'auto',
                      top: getElementSize(canDrag, 40),
                      zIndex: '301'
                    }}
                  >
                    {canDrag && curPointData && curPointData.i === i ? (
                      <View className={styles.dragItemChild}></View>
                    ) : null}
                    <DynamicEngine canDrag={canDrag} type={type} config={config} />
                  </View>
                );
              })}
          </View>
        </View>
      )}

      {}

      {floatPointData.length > 0 ? (
        <View
          style={{
            position: canDrag ? 'absolute' : 'fixed',
            overflow: 'hidden'
          }}
          id='floatPointDataWrapper'
          className={styles.floatPointDataWrapper}
        >
          {canDrag ? (
            <ReactGridLayout
              cols={24}
              rowHeight={1}
              layout={floatPointData}
              margin={[0, 0]}
              className={styles.layout}
              onLayoutChange={onLayoutChange}
              style={{ width: '100%' }}
            >
              {floatPointData.map((value) => {
                const { type, config, i } = value;
                return (
                  <View
                    key={i}
                    className={`
                        ${canDrag ? styles.dragItem : ''}
                      `}
                    onClick={(e) => {
                      handleClickTemplate(value, e);
                    }}
                    onContextMenu={(e) => {
                      onContextMenu(value, e);
                    }}
                    style={{
                      left: '0',
                      top: '0'
                    }}
                  >
                    {curPointData && curPointData.i === i ? (
                      <View className={styles.dragItemChild}></View>
                    ) : null}
                    <DynamicEngine canDrag={canDrag} type={type} config={config} />
                  </View>
                );
              })}
            </ReactGridLayout>
          ) : (
            floatPointData.map((value) => {
              const { type, config, i } = value;
              return (
                <View
                  key={i}
                  className={canDrag ? styles.dragItem : ''}
                  onClick={(e) => {
                    handleClickTemplate(value, e);
                  }}
                  onContextMenu={(e) => {
                    onContextMenu(value, e);
                  }}
                  style={{
                    left: '0',
                    top: '0'
                  }}
                >
                  {curPointData && curPointData.i === i ? (
                    <View className={styles.dragItemChild}></View>
                  ) : null}
                  <DynamicEngine canDrag={canDrag} type={type} config={config} />
                </View>
              );
            })
          )}
        </View>
      ) : null}

      {hotZoneFloatPointData.length > 0 &&
        (canDrag
          ? hotZoneFloatPointData.map((value) => {
              const { type, config, i } = value;
              const { position, position2 } = config;

              const top =
                config.isFloat === 1 ? null : getElementSize(canDrag, position[1].value);
              const bottom =
                config.isFloat === 1 ? getElementSize(canDrag, position2[1].value) : null;

              const left =
                config.isFloat === 1
                  ? getElementSize(canDrag, position2[0].value)
                  : getElementSize(canDrag, position[0].value);

              return (
                <HotZone
                  key={i}
                  handleClickTemplate={(e) => {
                    handleClickTemplate(value, e);
                  }}
                  handleContextMenu={(e) => {
                    onContextMenu(value, e);
                  }}
                  id={i}
                  className={styles.dragItemHotZone}
                  style={{
                    position: 'absolute',
                    left,
                    top,
                    bottom,
                    zIndex: '101'
                  }}
                >
                  {curPointData && curPointData.i === i ? (
                    <View className={styles.dragItemHotZoneChild}></View>
                  ) : null}
                  <DynamicEngine canDrag={canDrag} type={type} config={config} />
                </HotZone>
              );
            })
          : hotZoneFloatPointData.map((value) => {
              const { type, config, i } = value;
              const { position, position2 } = config;

              const top =
                config.isFloat === 1 ? null : getElementSize(canDrag, position[1].value);
              const bottom =
                config.isFloat === 1 ? getElementSize(canDrag, position2[1].value) : null;

              const left =
                config.isFloat === 1
                  ? getElementSize(canDrag, position2[0].value)
                  : getElementSize(canDrag, position[0].value);

              return (
                <View
                  key={i}
                  handleClickTemplate={(e) => {
                    handleClickTemplate(value, e);
                  }}
                  handleContextMenu={(e) => {
                    onContextMenu(value, e);
                  }}
                  id={i}
                  className={styles.dragItemHotZone}
                  style={{
                    position: 'absolute',
                    left,
                    top,
                    bottom,
                    zIndex: '101'
                  }}
                >
                  <DynamicEngine canDrag={canDrag} type={type} config={config} />
                </View>
              );
            }))}
    </>
  );
};

export default ViewRender;
