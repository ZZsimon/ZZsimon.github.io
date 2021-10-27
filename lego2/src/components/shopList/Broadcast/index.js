import React, { memo, Component } from 'react';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import { getElementSize } from '@/utils/getElementSize';
import { request } from '@/request';

import Scroll from './scroll';

import styles from './index.module.scss';

class Broadcast extends Component {
  channel = getCurrentInstance().router.params.channel || '';

  state = {
    list: [],
    uiData: []
  };
  componentDidMount() {
    const isAdmin = window.location.href.indexOf('home') > -1;
    if (isAdmin) {
      return;
    }
    this.fetchData({
      isFirst: true
    });
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  fetchData = async ({ fetch, isFirst }) => {
    const { uiData } = this.state;
    if (uiData.length > 0 && !fetch) {
      return;
    }
    const res = await request('/xinmai-order/topic-marquee', {
      marketChannel: this.channel
    });
    this.setState({
      list: res.data,
      uiData: res.data
    });
    if (isFirst) {
      setInterval(this.changeUiData, 3000);
    }
  };

  changeUiData = () => {
    const { uiData } = this.state;
    const _uiData = uiData.slice(1);
    if (_uiData.length === 0) {
      this.fetchData({
        fetch: true
      });
      return;
    }
    this.setState({ uiData: _uiData });
  };

  render() {
    const { title, isTpl, canDrag, width, height, bgUrl, fontColor } = this.props;
    const { list, uiData } = this.state;
    const _list = uiData.slice(0, 1);
    return (
      <>
        {isTpl && (
          <View className={styles.imgTpl}>
            <Image
              className={styles.image}
              src='https://resource.xinmai100.com/authUser/2021060110342073400269.png'
            />
            <View className={styles.title}>{title}</View>
          </View>
        )}
        {!isTpl && canDrag && (
          <View
            style={{
              width: getElementSize(canDrag, width),
              height: getElementSize(canDrag, height),
              color: fontColor,
              backgroundImage: `url('${bgUrl}')`
            }}
            className={`imageWrapper ${styles.imageWrapper} ${
              canDrag ? styles.eventsNone : null
            }`}
          >
            <View
              style={{
                height: getElementSize(canDrag, height),
                lineHeight: getElementSize(canDrag, height)
              }}
              className={styles.text}
            >
              199******88已报名，1分钟前
            </View>
          </View>
        )}

        {!isTpl && !canDrag && list.length > 0 && (
          <View
            style={{
              width: getElementSize(canDrag, width),
              height: getElementSize(canDrag, height),
              color: fontColor,
              backgroundImage: `url('${bgUrl}')`
            }}
            className={`imageWrapper ${styles.imageWrapper} ${
              canDrag ? styles.eventsNone : null
            }`}
          >
            <Scroll>
              {_list.map((item, index) => {
                return (
                  <View
                    style={{
                      height: getElementSize(canDrag, height),
                      lineHeight: getElementSize(canDrag, height)
                    }}
                    key={index}
                    className={styles.text}
                  >
                    {item.message}
                  </View>
                );
              })}
            </Scroll>
          </View>
        )}
      </>
    );
  }
}

export default Broadcast;
