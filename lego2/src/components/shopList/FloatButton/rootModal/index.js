import React, { Component } from 'react';
import { View } from '@tarojs/components';
import ReactDOM from 'react-dom';
import styles from './index.module.scss';

const modalRoot = document.getElementById('app');

class Modal extends Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }

  componentDidMount() {
    modalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    modalRoot.removeChild(this.el);
  }

  render() {
    const { visible } = this.props;
    if (!visible) {
      return null;
    }
    return (
      <>
        {ReactDOM.createPortal(
          <View className={styles.mask}>{this.props.children}</View>,
          this.el
        )}
      </>
    );
  }
}

export default Modal;
