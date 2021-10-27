import React, { memo, Component } from 'react';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';

export default class Scroll extends React.Component {
  state = {
    rollClass: ''
  };
  setScrollStyle = () => {
    const uid = Math.random().toString(36).substr(2);
    const style = document.createElement('style');
    style.innerHTML = `@-webkit-keyframes rowup${uid} {
              0% {
                  -webkit-transform: translate3d(0, 0, 0);
                  transform: translate3d(0, 0, 0);
              }
              25% {
                -webkit-transform: translate3d(0, 0, 0);
                transform: translate3d(0, 0, 0);
              }
              75% {
                  -webkit-transform: translate3d(0, 0, 0);
                  transform: translate3d(0, 0, 0);
              }
              100% {
                  -webkit-transform: translate3d(0, -50%, 0);
                  transform: translate3d(0, -50%, 0);
              }
          }
          @keyframes rowup${uid} {
            0% {
                -webkit-transform: translate3d(0, 0, 0);
                transform: translate3d(0, 50%, 0);
            }
            25% {
                -webkit-transform: translate3d(0, 0, 0);
                transform: translate3d(0, 0, 0);
            }
            75% {
                -webkit-transform: translate3d(0, 0, 0);
                transform: translate3d(0, 0, 0);
            }
            100% {
                -webkit-transform: translate3d(0,-100%, 0);
                transform: translate3d(0,-100%, 0);
            }
        }
        .rowup-${uid}{
            -webkit-animation:3s rowup${uid} linear infinite normal;
            animation: 3s rowup${uid} linear infinite normal;
        }`;
    document.getElementsByTagName('head')[0].appendChild(style);
    return `rowup-${uid}`;
  };

  componentDidMount() {
    const scrollContent = document.querySelector('.scroll .scroll-content');
    if (scrollContent) {
      const scrollClass = this.setScrollStyle(this.props.speed);
      this.setState({
        rollClass: scrollClass
      });
    }
  }
  render() {
    const rollClass = this.state.rollClass ? ' ' + this.state.rollClass : '';
    return (
      <View className='scroll' style={{ height: this.props.height }}>
        <View className={'scroll-content' + rollClass}>
          {this.props.children}
          {/* {this.props.children} */}
        </View>
      </View>
    );
  }
}
