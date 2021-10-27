import Taro, { getCurrentInstance } from '@tarojs/taro';
import React, { Component } from 'react';
import { deCodeStr } from '@/utils/deCodeStr';
import { getElementSize2 } from '@/utils/getElementSize2';
import { View, Text, Image, Icon } from '@tarojs/components';
import PageContext from '@/components/pageContext';
import { getWxConfig } from '@/utils/getWxConfig';
import { isWeixinCient } from '@/utils/isWeixinCient';
import { request } from '@/request';
import axios from 'axios';

import InviteSuccess from './component-invite-success';
import CountDown from './component-countDown';
import AddTeacher from './component-addTeacher';
import QrCode from './component-qrCode';

import styles from './index.module.scss';
import tplStyles from './tpl.module.scss';

class TeamUp extends Component {
  state = {
    detail: {},
    users: [],
    weixinNickName: '',
    weixinAvatar: '',
    showInviteModal: false,
    isClickedInvite: false,
    showAddTeacherModal: false,
    serviceQrCode: '',
    nowTime: '',
    endTime: '',
    helpActivityId: '',
    bgUrl: this.props.bgUrl,

    shareLoading: false,
    isShowQrCode: false,
    shareData: '',
    isWx: isWeixinCient()
  };

  componentDidMount() {
    const { canDrag, isTpl } = this.props;
    if (!isTpl && !canDrag) {
      this.fetchData();
    }
  }

  goWx = () => {
    const { code, isWx } = this.state;
    let url = window.location.href;
    if (isWx && code) {
      url = window.location.href.split('?')[0];
    }

    const appId = 'wx1db477e0e9a3e4fa';
    const redirectUri = encodeURIComponent(url);
    const target = `https://wxauth.xinmai100.com/getWxCode.html?appid=${appId}&scope=snsapi_base&redirect_uri=${redirectUri}`;
    window.location.href = target;
  };

  fetchData = async () => {
    const { router } = getCurrentInstance();
    const { helpActivityCode, channel } = router.params;
    const { helpPersonNum } = this.props;
    const res = await request('/xinmai-order/join-help-activity', {
      helpActivityCode,
      marketChannel: channel
    });
    this.setState({
      users: res.data.users,
      weixinNickName: res.data.weixinNickName,
      weixinAvatar: res.data.weixinAvatar,
      serviceQrCode: res.data.serviceQrCode,
      nowTime: res.data.nowTime,
      endTime: res.data.endTime,
      helpActivityId: res.data.helpActivityId,
      showAddTeacherModal: res.data.users.length > +helpPersonNum,
      isClickedInvite: res.data.users.length > +helpPersonNum
    });
    this.toogleInviteModal(res.data.weixinNickName !== res.data.users[0].weixinNickname);
  };

  toogleInviteModal = (bool) => {
    if (bool && !this.timer) {
      this.timer = setTimeout(() => {
        this.setState({
          showInviteModal: false
        });
        clearTimeout(this.timer);
        this.timer = null;
      }, 2000);
    }

    if (!bool && this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    this.setState({
      showInviteModal: bool
    });
  };

  toogleAddTeacherModal = (bool) => {
    this.setState({ showAddTeacherModal: bool });
  };

  shareCourseInfo = async () => {
    const { helpActivityId, bgUrl } = this.state;
    const { router } = getCurrentInstance();
    const { channel } = router.params;
    this.setState({
      shareLoading: true
    });

    const res = await request(
      '/xinmai-order/share-help-activity-image',
      {
        helpActivityId,
        imageUrl: bgUrl,
        marketChannel: channel
      },
      {
        responseType: 'blob'
      }
    );
    this.setState({
      shareLoading: false,
      shareData: res
    });
    this.toogleQrCode(true);
  };

  toogleQrCode = (bool) => {
    console.log(bool, 'bool');
    this.setState({
      isShowQrCode: bool,
      isClickedInvite: true
    });
    if (bool && !this.timer2) {
      this.timer2 = setTimeout(() => {
        this.toogleQrCode(false);
        clearTimeout(this.timer2);
        this.timer2 = null;
      }, 5000);
    }

    if (!bool) {
      this.toogleAddTeacherModal(true);
      if (this.timer2) {
        clearTimeout(this.timer2);
        this.timer2 = null;
      }
    }
  };

  shareCallback = () => {
    // 显示分享成功
    this.toogleInviteModal(true);
    this.toogleAddTeacherModal(true);
  };

  render() {
    const { isTpl, title, canDrag, helpPersonNum } = this.props;
    const {
      detail,
      users,
      weixinNickName,
      weixinAvatar,
      isClickedInvite,
      serviceQrCode,
      nowTime,
      endTime,
      isShowQrCode,
      shareData,
      shareLoading
    } = this.state;

    const personList = Array.from({ length: +helpPersonNum }, (item, index) => {
      return users[index] ? users[index] : undefined;
    });

    const restPerson = +helpPersonNum - users.length;

    console.log(this.state.showAddTeacherModal, 'this.state.showAddTeacherModal');

    // 左侧组件模版
    if (isTpl) {
      return (
        <View className={tplStyles.imgTpl}>
          <Image
            className={tplStyles.image}
            src='https://resource.xinmai100.com/authUser/2021071315311487228267.png'
          />
          <View className={tplStyles.title}>{title}</View>
        </View>
      );
    }

    return (
      <PageContext.Provider
        value={{
          detail
        }}
      >
        <View
          style={{
            height: canDrag ? getElementSize2(canDrag, 580) : 'auto',
            paddingBottom: getElementSize2(canDrag, 70)
          }}
          className={`${styles['preview-wrapper']} ${canDrag ? styles.eventsNone : ''}`}
        >
          <View
            style={{
              width: getElementSize2(canDrag, 368),
              height: getElementSize2(canDrag, 40),
              fontSize: getElementSize2(canDrag, 28),
              marginTop: getElementSize2(canDrag, 32)
            }}
            className={styles.title}
          >
            <Text
              style={{
                width: getElementSize2(canDrag, 100),
                height: getElementSize2(canDrag, 1),
                left: getElementSize2(canDrag, -100)
              }}
              className={styles.line1}
            ></Text>
            {restPerson > 0 ? (
              <>
                还差<Text className={styles.personNum}>{restPerson}</Text>人可解锁课程免费学
              </>
            ) : (
              <Text className={styles.personNum}>课程解锁成功</Text>
            )}
            <Text
              style={{
                width: getElementSize2(canDrag, 100),
                height: getElementSize2(canDrag, 1),
                right: getElementSize2(canDrag, -100)
              }}
              className={styles.line2}
            ></Text>
          </View>

          <View
            style={{
              marginTop: getElementSize2(canDrag, 46),
              paddingLeft: getElementSize2(canDrag, 56),
              paddingRight: getElementSize2(canDrag, 56),
              marginBottom: getElementSize2(canDrag, 60),
              height: getElementSize2(canDrag, 100)
            }}
            className={styles.personBox}
          >
            {personList.map((item, index) => {
              return item ? (
                <View
                  key={index}
                  className={`
                  ${styles.person}
                  ${weixinNickName === item.weixinNickname ? styles.hasBorder : null}
                `}
                >
                  {index === 0 ? <Text className={styles.captain}>队长</Text> : null}
                  <Image className={styles.weixinAvatar} src={item.weixinAvatar} />
                </View>
              ) : (
                <View
                  style={{
                    width: getElementSize2(canDrag, 90),
                    height: getElementSize2(canDrag, 90),
                    marginLeft: getElementSize2(canDrag, 15),
                    marginRight: getElementSize2(canDrag, 15),
                    marginBottom: getElementSize2(canDrag, 15),
                    fontSize: getElementSize2(canDrag, 26)
                  }}
                  key={index}
                  className={styles.personEmpty}
                >
                  +
                </View>
              );
            })}
          </View>

          {canDrag ? (
            <View
              style={{
                fontSize: getElementSize2(canDrag, 26),
                height: getElementSize2(canDrag, 42),
                marginBottom: getElementSize2(canDrag, 28)
              }}
              className={styles.timeBox}
            >
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
                48
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
                00
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
                00
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
                00
              </Text>
            </View>
          ) : (
            <View
              style={{
                fontSize: getElementSize2(canDrag, 26),
                height: getElementSize2(canDrag, 42),
                marginBottom: getElementSize2(canDrag, 28)
              }}
              className={styles.timeBox}
            >
              {nowTime ? (
                <CountDown canDrag={canDrag} startTime={nowTime} endTime={endTime} />
              ) : null}
            </View>
          )}

          <View
            style={{
              marginBottom: getElementSize2(canDrag, 28),
              width: getElementSize2(canDrag, 600),
              height: getElementSize2(canDrag, 96),
              borderRadius: getElementSize2(canDrag, 50),
              fontSize: getElementSize2(canDrag, 34)
            }}
            onClick={this.shareCourseInfo}
            className={styles.inviteButton}
          >
            邀请好友组队开课
          </View>

          {isClickedInvite ? (
            <View
              style={{
                fontSize: getElementSize2(canDrag, 28)
              }}
              onClick={this.toogleAddTeacherModal}
              className={styles.addTeacher}
            >
              添加老师开课
            </View>
          ) : null}

          <InviteSuccess
            toogleModal={this.toogleInviteModal}
            showModal={this.state.showInviteModal}
          />
          <AddTeacher
            weixinNickName={weixinNickName}
            weixinAvatar={weixinAvatar}
            serviceQrCode={serviceQrCode}
            toogleModal={this.toogleAddTeacherModal}
            showModal={this.state.showAddTeacherModal}
          />

          {isShowQrCode && shareData ? (
            <QrCode toogleQrCode={this.toogleQrCode} shareData={shareData} detail={detail} />
          ) : null}

          {shareLoading ? (
            <View className={styles.shareLoading}>
              <Icon color='#eee' size='20' className={styles.loading} type='waiting' />
              <View className={styles['shareLoading-text']}>生成海报中...</View>
            </View>
          ) : null}
        </View>
      </PageContext.Provider>
    );
  }
}

export default TeamUp;
