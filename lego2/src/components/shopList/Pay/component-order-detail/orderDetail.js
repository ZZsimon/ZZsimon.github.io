import React, { Component } from 'react';
import { View, Text, Image } from '@tarojs/components';

import Pay from '../component-pay';

import selected from './assets/selected-pay.png';
import styles from './orderDetail.module.scss';

let courseDetailFlag = true;
let orderDetailFlag = true;
let courseInitialProductPrice;

class OrderDetailComponent extends Component {
  componentWillUnmount() {
    courseDetailFlag = true;
    orderDetailFlag = true;
    courseInitialProductPrice = undefined;
  }

  changeHuaBeiAmount = async (payAmount) => {
    const { courseDetail, orderDetail } = this.props;
    const { hbfqCalculate } = this.props.orderStore;
    const res = await hbfqCalculate({
      payAmount,
      courseId: courseDetail.productId
    });
    if (orderDetail) {
      const oldData = this.props.orderDetail.detail;
      this.props.orderDetail.detail = {
        ...oldData,
        hbFqParam: res.data
      };
    } else {
      const oldData = this.props.courseDetailStore.detail;
      this.props.courseDetailStore.detail = {
        ...oldData,
        hbFqParam: res.data
      };
    }
  };

  render() {
    const { courseDetail, orderDetail, showProtoco } = this.props;

    if (courseDetail && courseDetail.originalPrice && courseDetailFlag) {
      courseInitialProductPrice = courseDetail.productPrice;
      courseDetailFlag = false;
    }

    if (courseDetail && !courseDetail.originalPrice && courseDetailFlag) {
      courseInitialProductPrice = courseDetail.productPrice;
      courseDetailFlag = false;
    }

    if (orderDetail && orderDetail.originalPrice && orderDetailFlag) {
      orderDetailFlag = false;
    }

    if (orderDetail && !orderDetail.originalPrice && orderDetailFlag) {
      orderDetailFlag = false;
    }

    return (
      <View className={styles['order-detail-wrapper']}>
        {courseDetail ? (
          <View className={styles['detail-content']}>{courseDetail.productName}</View>
        ) : null}

        {courseDetail ? (
          <View className={styles['price-wrapper']}>
            <View className={styles['price-item']}>
              <Text>小计</Text>
              <Text className={styles['real-price']}>
                ¥{courseInitialProductPrice.toFixed(2)}
              </Text>
            </View>
          </View>
        ) : null}

        {/* 确认订单 */}
        {courseDetail && courseDetail.productPrice > 0 ? (
          <Pay
            getPayWay={(currentPay) => this.props.getPayWay(currentPay)}
            getHuaBeiCount={(currentHuaBei) => this.props.getHuaBeiCount(currentHuaBei)}
            initPay={(payList) => this.props.initPay(payList)}
            detail={courseDetail}
          />
        ) : null}

        <View className={styles.selected}>
          <Image className={styles.selectedImg} src={selected} />
          我已经阅读并同意
          <Text className={styles.policy} onClick={showProtoco}>
            《售后政策》
          </Text>
        </View>
      </View>
    );
  }
}

export default OrderDetailComponent;
