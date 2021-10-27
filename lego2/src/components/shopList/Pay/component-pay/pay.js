import React, { Component } from 'react';
import { View, Text, Image } from '@tarojs/components';

import { isWeixinCient } from '@/utils/isWeixinCient';

import aliLogo from './assets/ali-logo.png';
import selectedPay from './assets/selected-pay.png';
import wxLogo from './assets/wx-logo.png';
import huabei from './assets/花呗分期.png';
import huabeiSelect from './assets/选中 (1).png';
import JDLoanLogo from './assets/jd_loan.png';

import styles from './pay.module.scss';

class Pay extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      currentPay: 2,
      payList: [],
      currentHuaBei: 3
    };
  }

  componentDidMount() {
    this.setState({
      currentPay: this.getPayList()[0],
      payList: this.getPayList()
    });
    this.props.initPay(this.getPayList());
  }

  getPayList = () => {
    const { detail } = this.props;

    // 微信环境下
    if (isWeixinCient()) {
      return detail.supportPayment.filter((each) => each === 1 || each === 6).sort();
    }
    // 不是微信环境下
    const initList = [2, 1, 3, 6];
    const formatList = [];
    initList.forEach((item) => {
      if (detail.supportPayment.includes(item)) {
        formatList.push(item);
      }
    });
    return formatList;
  };

  changePay = (currentPay) => {
    this.setState({
      currentPay
    });
    this.props.getPayWay(currentPay);
  };

  changeHuaBei = (currentHuaBei) => {
    this.setState({
      currentHuaBei
    });
    this.props.getHuaBeiCount(currentHuaBei);
  };

  render() {
    const { currentPay, payList, currentHuaBei } = this.state;
    const { detail } = this.props;
    const PayItem = ({ item }) => {
      const payMap = {
        1: {
          name: '微信支付',
          logo: wxLogo,
          className: styles.wxLogo
        },
        2: {
          name: '支付宝',
          logo: aliLogo,
          className: styles.aliLogo
        },
        3: {
          name: '花呗分期',
          logo: huabei,
          className: styles.huabeiLogo
        },
        6: {
          name: '白条分期',
          logo: JDLoanLogo,
          className: styles.JDLoanLogo
        }
      };
      const name = payMap[item].name;
      const logo = payMap[item].logo;
      const className = payMap[item].className;
      const showHuaBeiList = !!(currentPay === 3 && item === 3);
      const huabeiMap2 = detail.hbFqParam.map((item2) => {
        return {
          price: item2.eachPrinAndFee,
          count: item2.fqNum,
          cost: item2.eachFee,
          isFreeFee: item2.isFreeFee
        };
      });
      const huabeiMap = huabeiMap2;
      // const huabeiMap = _.sortBy(huabeiMap2, (item3) => item3.count);

      return (
        <>
          <View className={styles['pay-wrapper']} onClick={() => this.changePay(item)}>
            <View className={styles.left}>
              <Image src={logo} alt='' className={className} />
              <Text className={styles.name}>{name}</Text>
            </View>
            {currentPay === item ? (
              <Image src={selectedPay} alt='' className={styles.right} />
            ) : null}
          </View>

          {showHuaBeiList ? (
            <View className={styles['hb-list-box']}>
              {huabeiMap.map((item2) => {
                return (
                  <View
                    onClick={() => this.changeHuaBei(item2.count)}
                    className={`
                      ${currentHuaBei === item2.count ? styles.active : ''}
                      ${styles['hb-item']}
                    `}
                    key={item2.count}
                  >
                    <View className={styles['hb-item-top']}>
                      ￥{item2.price.toFixed(2)} X {item2.count}期
                    </View>
                    <View className={styles['hb-item-bottom']}>
                      {item2.isFreeFee === 1 ? <Text className={styles.span}></Text> : null}
                      手续费 ￥{item2.cost.toFixed(2)}/期
                    </View>
                    {currentHuaBei === item2.count ? (
                      <Image
                        className={styles.huabeiSelect}
                        src={huabeiSelect}
                        alt='huabeiSelect'
                      />
                    ) : null}
                  </View>
                );
              })}
            </View>
          ) : null}
        </>
      );
    };
    return payList.length > 0 ? (
      <View className={styles['pay-wrapper-out']}>
        <View className={styles.title}>请选择支付方式：</View>
        {payList.map((item, index) => {
          return <PayItem key={index} item={item} />;
        })}
      </View>
    ) : null;
  }
}

export default Pay;
