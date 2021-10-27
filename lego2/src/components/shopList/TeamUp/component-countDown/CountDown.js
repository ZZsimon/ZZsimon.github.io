import Taro, { getCurrentInstance } from '@tarojs/taro';
import React, { Component } from 'react';
import { View, Input, Text, Image } from '@tarojs/components';
import { request } from '@/request';
import { deCodeStr } from '@/utils/deCodeStr';
import styles from './index.module.scss';
import { getElementSize2 } from '@/utils/getElementSize2';

class CountDown extends Component {
  leftTime = this.props.endTime - this.props.startTime;

  state = {
    time: {}
  };

  componentDidMount() {
    this.timer = setInterval(this.countDown, 99);
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  countDown = () => {
    if (String(this.leftTime) === 'NaN') {
      return;
    }
    if (this.leftTime <= 0) {
      this.leftTime = 24 * 3600 * 1000;
      this.setState(
        {
          time: {
            h: '24',
            m: '00',
            s: '00',
            ms: '00'
          }
        },
        () => {
          clearInterval(this.timer);
          this.timer = null;
          this.timer = setInterval(this.countDown, 99);
        }
      );
      return;
    }
    const d = Math.floor(this.leftTime / 1000 / 60 / 60 / 24);
    let h = Math.floor((this.leftTime / 1000 / 60 / 60) % 24) + d * 24;
    let m = Math.floor((this.leftTime / 1000 / 60) % 60);
    let s = Math.floor((this.leftTime / 1000) % 60);
    let ms = Math.floor(this.leftTime % 1000);
    h = this.addZero(h);
    m = this.addZero(m);
    s = this.addZero(s);
    ms = this.addZero(ms);
    this.leftTime -= 99;
    this.setState({
      time: {
        h,
        m,
        s,
        ms
      }
    });
  };

  addZero(i) {
    const msFixed = this.props.msFixed || 2;

    if (i < 10) {
      return `0${i}`;
    }
    if (i > 99) {
      return `${String(i).substr(0, msFixed)}`;
    }
    return `${i}`;
  }

  render() {
    const { time } = this.state;
    const { h, m, s, ms } = time;
    const { canDrag } = this.props;
    return (
      <>
        距结束
        <Text
          style={{
            width: getElementSize2(canDrag, 42),
            height: getElementSize2(canDrag, 42),
            borderRadius: getElementSize2(canDrag, 4),
            fontSize: getElementSize2(canDrag, 24),
            marginLeft: getElementSize2(canDrag, 10),
            marginRight: getElementSize2(canDrag, 10)
          }}
          className={styles.time}
        >
          {h}
        </Text>
        :
        <Text
          style={{
            width: getElementSize2(canDrag, 42),
            height: getElementSize2(canDrag, 42),
            borderRadius: getElementSize2(canDrag, 4),
            fontSize: getElementSize2(canDrag, 24),
            marginLeft: getElementSize2(canDrag, 10),
            marginRight: getElementSize2(canDrag, 10)
          }}
          className={styles.time}
        >
          {m}
        </Text>
        :
        <Text
          style={{
            width: getElementSize2(canDrag, 42),
            height: getElementSize2(canDrag, 42),
            borderRadius: getElementSize2(canDrag, 4),
            fontSize: getElementSize2(canDrag, 24),
            marginLeft: getElementSize2(canDrag, 10),
            marginRight: getElementSize2(canDrag, 10)
          }}
          className={styles.time}
        >
          {s}
        </Text>
        :
        <Text
          style={{
            width: getElementSize2(canDrag, 42),
            height: getElementSize2(canDrag, 42),
            borderRadius: getElementSize2(canDrag, 4),
            fontSize: getElementSize2(canDrag, 24),
            marginLeft: getElementSize2(canDrag, 10),
            marginRight: getElementSize2(canDrag, 10)
          }}
          className={styles.time}
        >
          {ms}
        </Text>
      </>
    );
  }
}

export default CountDown;
