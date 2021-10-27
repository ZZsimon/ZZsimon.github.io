export const updateData = ({
  value,
  curPointData,
  name,
  setcurPointData,
  pointData,
  updatePointData
}) => {
  const config = { ...curPointData.config };

  if (Array.isArray(name)) {
    name.forEach((item, index) => {
      config[item] = value[index];
    });
  } else {
    config[name] = value;
  }
  const _curPointData = {
    ...curPointData,
    config
  };
  setcurPointData(_curPointData);

  const _pointData = pointData.map((item) => {
    if (item.i === _curPointData.i) {
      return { ..._curPointData };
    }
    return item;
  });

  updatePointData(_pointData);
};
