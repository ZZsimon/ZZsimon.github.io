import React, { useState, useEffect } from 'react';
import Taro, { useRouter } from '@tarojs/taro';
import uuid from 'uuid/v4';
import { View } from '@tarojs/components';
import PageContext from '@/components/pageContext';
import { request } from '@/request';

import { isAdmin } from '@/utils/bom';
import { pageInfoMap } from '@/utils/const';

import PageModal from './pageModal';
import Header from './Header';
import Left from './Left';
import Middle from './Middle';
import Right from './Right';

import styles from './index.module.scss';

const Container = () => {
  const router = useRouter();
  const { topicId = '', token = '' } = router.params;
  const basePointDataScrollWrapper = document.getElementById('basePointDataScrollWrapper');
  const topicDetail = async () => {
    const res = JSON.parse(localStorage.getItem('topicDetailData'));

    if (!res) {
      setvisible(true);
      return;
    }

    const pageList =
      res.data.elements.length > 0 && res.data.elements[0]
        ? res.data.elements
        : pageInfoMap[res.data.applicationScenarios];
    pageList[0].title = res.data.pageTitle;

    const defaultPageInfo = {
      pageTitle: res.data.pageTitle,
      pageSubTitle: res.data.topicName,
      pageType: res.data.topicType,
      pageScenes: res.data.applicationScenarios,
      pageList: pageList,
      isPublish: res.data.isPublish === 1 ? true : false,
      topicId: topicId
    };
    setDefaultPageInfo(defaultPageInfo);
  };

  useEffect(() => {
    topicDetail();
  }, []);

  const setDefaultPageInfo = (defaultPageInfo) => {
    setpageInfo(defaultPageInfo);
    setcurrentPage(defaultPageInfo.pageList[0]);
    setpointData(defaultPageInfo.pageList[0].pointData);
    setvisible(false);
  };

  const [visible, setvisible] = useState(false);

  const [pageInfo, setpageInfo] = useState(null);
  const [currentPage, setcurrentPage] = useState(null);
  const changePage = (item) => {
    if (item.pageId === currentPage.pageId) {
      return;
    }
    setcurrentPage(item);
    updatePointData(item.pointData, item.pageId);
    setcurPointData(null);
  };

  const [pointData, setpointData] = useState([]);

  const addPointData = (newPoint, pageId = currentPage.pageId) => {
    const findPayPoint = pointData.find((item) => item.type === 'Pay');
    if (findPayPoint) {
      Taro.showToast({
        title: '一个页面只允许有一个业务组件A',
        icon: 'none',
        duration: 1000,
        mask: true
      });
      return;
    }
    const _pointData = [...pointData, newPoint];
    setpointData(_pointData);

    const pageList = pageInfo.pageList.map((item) => {
      return item.pageId === pageId ? { ...item, pointData: _pointData } : { ...item };
    });
    setpageInfo({ ...pageInfo, pageList: pageList });
  };

  const updatePointData = (_pointData, pageId = currentPage.pageId) => {
    const list = _pointData.map((item) => {
      return {
        ...item,
        h: +item.config.height
      };
    });
    setpointData(list);
    const pageList = pageInfo.pageList.map((item) => {
      return item.pageId === pageId ? { ...item, pointData: list } : { ...item };
    });
    setpageInfo({ ...pageInfo, pageList: pageList });
  };

  const deleteCurPointData = () => {
    setcontextMenuVisible(false);
    Taro.showModal({
      title: '确定要删除当前选中的组件吗？',
      content: '',
      success: function (res) {
        if (res.confirm) {
          const newPointData = pointData.filter((item) => item.i !== curPointData.i);
          const _basePointData = newPointData.filter(
            (item) => item.type !== 'FloatButton' && item.type !== 'HotZone'
          );
          const _newPointData =
            _basePointData.length === 0
              ? newPointData.filter(
                  (item) =>
                    item.type !== 'HotZone' ||
                    (item.type === 'HotZone' && item.config.isFloat === 1)
                )
              : newPointData;
          updatePointData(_newPointData);
          setcurPointData(null);
        }
      },
      confirmColor: '#00a9ff'
    });
  };

  const copyCurPointData = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const id = uuid();
    const newPointData = { ...curPointData };
    newPointData.i = id;
    if (newPointData.type === 'HotZone') {
      const position = curPointData.config.position;
      const areaSize = curPointData.config.areaSize;

      const _left = Number(position[0].value) + 10;
      const maxLeft = 375 - Number(areaSize[0].value);
      const left = _left < 0 ? 0 : _left > maxLeft ? Number(position[0].value) - 10 : _left;

      const _top = Number(position[1].value) + 10;
      const containerClient =
        newPointData.config.isFloat === 1 ? 667 : basePointDataScrollWrapper.clientHeight;

      const maxTop = containerClient - Number(areaSize[1].value);
      const top = _top < 0 ? 0 : _top > maxTop ? Number(position[1].value) - 10 : _top;

      const list = [
        { ...position[0], value: left },
        { ...position[1], value: top }
      ];

      newPointData.config = {
        ...newPointData.config,
        position: list
      };
    }
    addPointData(newPointData);
    setcurPointData(newPointData);
    setcontextMenuVisible(false);
  };

  // 选中的当前组件数据
  const [curPointData, setcurPointData] = useState(null);

  const submit = async (cb) => {
    const res = JSON.parse(localStorage.getItem('topicDetailData'));
    res.data.isPublish = 0;
    res.data.elements = pageInfo.pageList;
    localStorage.setItem('topicDetailData', JSON.stringify(res));

    topicDetail();
    cb && cb();
  };

  const publish = async () => {
    const res = JSON.parse(localStorage.getItem('topicDetailData'));
    res.data.isPublish = 1;
    res.data.elements = pageInfo.pageList;
    localStorage.setItem('topicDetailData', JSON.stringify(res));
    Taro.showToast({
      title: '发布成功',
      icon: 'none',
      duration: 1000,
      mask: true
    });
    topicDetail();
  };

  const [contextMenuVisible, setcontextMenuVisible] = useState(false);

  const [contextMenuPosition, setcontextMenuPosition] = useState({
    top: 0,
    left: 0
  });

  const [editDataList, seteditDataList] = useState([]);

  const getFloatTypeData = () => {
    const { editData } = curPointData;
    // 是否有悬浮类型，没有的话直接返回原数据
    const selectIndex = editData.findIndex((item) => item.key === 'floatType');
    if (selectIndex < 0) {
      return editData;
    }

    let floatTypeData = [];
    const defaultFloatData = [
      {
        key: 'clickEvent',
        label: '点击事件',
        type: 'Select',
        optionList: [
          { value: '无跳转', key: 0 },
          { value: '跳转h5页面', key: 1 },
          { value: '某个业务功能：）', key: 3 }
        ]
      },
      {
        key: 'areaSize',
        label: '区域大小',
        type: 'DoubleInput',
        valueList: [
          {
            key: 'areaSizeWidth',
            label: '宽',
            value: 0
          },
          {
            key: 'areaSizeHeight',
            label: '高',
            value: 0
          }
        ]
      },
      {
        key: 'position',
        label: '位置坐标',
        type: 'DoubleInput',
        valueList: [
          {
            key: 'positionX',
            label: '左',
            value: 0
          },
          {
            key: 'positionY',
            label: '上',
            value: 0
          }
        ]
      }
    ];
    switch (curPointData.config.floatType) {
      case 0:
        floatTypeData = defaultFloatData;
        break;
      case 1:
        floatTypeData = [
          { key: 'initNumber', label: '报名初始值', type: 'Input' },
          { key: 'fontColor', label: '字体颜色', type: 'ColorInput' },
          {
            key: 'smsCode',
            label: '短信验证',
            type: 'Select',
            optionList: [
              { value: '是', key: 1 },
              { value: '否', key: 2 }
            ]
          }
        ];
        break;

      default:
        floatTypeData = defaultFloatData;
        break;
    }

    const _editData = [
      ...editData.slice(0, selectIndex + 2),
      ...floatTypeData,
      ...editData.slice(selectIndex + 2)
    ];
    return _editData;
  };

  const getHotZoneTypeData = (editData) => {
    // 是否有热区悬浮类型，没有的话直接返回原数据
    const selectIndex = editData.findIndex((item) => item.key === 'isFloat');
    if (selectIndex < 0) {
      return editData;
    }

    const positionData =
      curPointData.config.isFloat === 1
        ? {
            key: 'position2',
            label: '位置坐标',
            type: 'DoubleInput',
            valueList: [
              {
                key: 'positionX',
                label: '左',
                value: 0
              },
              {
                key: 'positionY',
                label: '下',
                value: 0
              }
            ]
          }
        : {
            key: 'position',
            label: '位置坐标',
            type: 'DoubleInput',
            valueList: [
              {
                key: 'positionX',
                label: '左',
                value: 0
              },
              {
                key: 'positionY',
                label: '上',
                value: 0
              }
            ]
          };

    const _editData = [...editData, positionData];
    return _editData;
  };

  /**
   * 根据不同事件类型，显示不同字段的输入框
   * 比如h5链接 -> 显示出一个链接地址的输入框
   * 比如课程ID -> 显示出一个输入课程ID的输入框
   */
  const getClickEventData = (editData) => {
    let clickEventData = [];
    switch (curPointData.config.clickEvent) {
      case 1:
        clickEventData = [{ key: 'h5Url', label: '链接地址', type: 'Input' }];
        break;
      case 2:
        clickEventData = [{ key: 'scrollTop', label: '锚定高度', type: 'Input' }];
        break;
      case 3:
        clickEventData = [{ key: 'lessonId', label: '我是label', type: 'Input' }];
        break;
      default:
        clickEventData = [];
        break;
    }
    const selectIndex = editData.findIndex((item) => item.key === 'clickEvent');
    const _editData = [
      ...editData.slice(0, selectIndex + 1),
      ...clickEventData,
      ...editData.slice(selectIndex + 1)
    ];
    return _editData;
  };

  const getEditData = () => {
    let editData = [];
    editData = getFloatTypeData();
    editData = getHotZoneTypeData(editData);
    editData = getClickEventData(editData);
    return editData;
  };

  useEffect(() => {
    const _editDataList = curPointData ? getEditData() : [];
    seteditDataList(_editDataList);
    return () => {
      seteditDataList([]);
    };
  }, [curPointData]);

  return (
    <PageContext.Provider
      value={{
        isAdmin,

        pageInfo,
        setpageInfo,
        currentPage,
        changePage,
        setvisible,

        pointData,
        updatePointData,
        addPointData,
        deleteCurPointData,
        copyCurPointData,

        curPointData,
        setcurPointData,

        submit,
        publish,

        contextMenuVisible,
        setcontextMenuVisible,
        contextMenuPosition,
        setcontextMenuPosition,

        editDataList,
        seteditDataList
      }}
    >
      {visible && (
        <PageModal
          setpageInfo={setpageInfo}
          setvisible={setvisible}
          pageInfo={pageInfo}
          visible={visible}
          setcurrentPage={setcurrentPage}
          setpointData={setpointData}
        />
      )}

      <View className={styles.container}>
        <Header />
        <View className={styles.content}>
          <Left />
          <Middle />
          <Right />
        </View>
      </View>
    </PageContext.Provider>
  );
};

export default Container;
