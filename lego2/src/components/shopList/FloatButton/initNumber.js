import React, { Component } from 'react';
import { deCodeStr } from '@/utils/deCodeStr';
import { getCurrentInstance } from '@tarojs/taro';
import { Text } from '@tarojs/components';
import { getElementSize } from '@/utils/getElementSize';
import { request } from '@/request';
import styles from './index.module.scss';

class InitNumber extends Component {
  remain = 0;
  initTotal = this.props.initNumber;
  state = {
    total: this.props.initNumber,
    channel: deCodeStr(getCurrentInstance().router.params.channel || '')
  };

  componentDidMount() {
    const { canDrag } = this.props;
    if (canDrag) {
      return;
    }
    if (+this.initTotal !== 0) {
      this.marketChannelLeadsSubmitCount();
    }
  }

  componentWillUnmount() {
    this.removeInterval();
  }

  marketChannelLeadsSubmitCount = async () => {
    const { channel } = this.state;

    const res = await request('/xinmai-order/market-channel-leads-submit-count', {
      marketChannelId: channel
    });

    // 剩余可报数量
    const _remain = this.initTotal - res.data;
    // 剩余可报数量 最小限制为9
    const remain = _remain > 9 ? _remain : 9;

    // 设置变化频率
    const numerator = _remain > 150 ? _remain : 291;
    const rate = 1500 / numerator;
    this.remain = remain;

    // 设置定时器
    this.interval = setInterval(() => this.tick(), rate);
  };
  tick = () => {
    const { total } = this.state;
    if (this.remain === total) {
      this.removeInterval();
    } else {
      this.setState({
        total: total - 1
      });
    }
  };

  removeInterval = () => {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  };

  render() {
    const { fontColor, initNumber, canDrag } = this.props;
    const { total } = this.state;
    return (
      +initNumber !== 0 && (
        <Text
          style={{
            color: fontColor,
            top: getElementSize(canDrag, 32),
            right: getElementSize(canDrag, 128),
            width: getElementSize(canDrag, 35),
            fontSize: getElementSize(canDrag, 20)
          }}
          className={styles.initNumber}
        >
          {canDrag ? initNumber : total}
        </Text>
      )
    );
  }
}

export default InitNumber;
