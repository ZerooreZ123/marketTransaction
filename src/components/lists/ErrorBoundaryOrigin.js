import React, { Component } from 'react';
import moment from 'moment';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidCatch(error, info) {
    console.log('程序报错, 存入monitor, error: ', error);
    window.superMonitor.errors.push({time: moment().format('YYYY-MM-DD HH:mm:ss'), error});
  }

  render() {
    return this.props.children
  }
}
