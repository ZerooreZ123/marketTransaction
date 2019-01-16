import React,{Component} from 'react';

// 分时
export const fsChartConfig = {
  title: '分时',
  type: 7,
  divide: 100,
  format: "%H:%M",
  panelFormat: "%Y-%m-%d    %H:%M",
  defaultNorm: ['VOLFS'],
  name: 'DIVHOUR',
}

// 日k
export const rkChartConfig = {
  title: '日k',
  type: 13,
  divide: 100,
  format: "%Y-%m-%d",
  panelFormat: "%Y-%m-%d",
  defaultNorm: ['VOLKX'],
  name: 'DAY',
}
