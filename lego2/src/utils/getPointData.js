/**
 * @param {组件布局数据，包含type、config、editableEl }pointData
 * @param {onLayoutChange回调函数提供的组件布局数据，不包含type、config、editableEl} layout
 * @param {是否能编辑} canDrag
 */
export const getPointData = (pointData, layout, canDrag) => {
  const reqData = [...pointData].map((item) => {
    let _item = { ...item };
    // 合并相同项
    layout.forEach((item2) => {
      if (item.i === item2.i) {
        _item = {
          ...item,
          ...item2,
          isDraggable: canDrag ? true : false
        };
      }
    });

    return _item;
  });
  return reqData;
};
