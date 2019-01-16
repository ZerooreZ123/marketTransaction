const option = {
  tooltip: {
    trigger: 'item',
    formatter: function (params, ticket, callback) {
      // debugger
      var res = params.name + '<br/>'
      res += params.marker + params.seriesName + '：'
        + (params.value).toFixed(2) + '亿<br/>'
      return res;
    }

  },
  legend: {
    data: ['净利润', '预测净利润', '每股收益', '预测每股收益'],
    x: 'center',
    textStyle: {
      color: "#fff"
    }
  },
  xAxis: [
    {
      type: 'category',
      data: [],
      axisLine: {
        lineStyle: {
          color: '#fff',
          width: 1,
        }
      }

    }
  ],
  yAxis: [
    {
      type: 'value',
      name: '单位:亿元',
      axisLabel: {
        formatter: '{value}亿'
      },
      splitLine: { show: false },
      axisLine: {
        lineStyle: {
          color: '#fff',
          width: 1,
        },
        formatter: function (value, index) {
          return value.toFixed(2);
        }
      }
    },
    {
      type: 'value',
      name: '单位:元',
      axisLabel: {
        formatter: '{value} '
      },
      splitLine: { show: false },
      axisLine: {
        lineStyle: {
          color: '#fff',
          width: 1,
        }
      }
    }
  ],
  series: [
    {
      name: '净利润',
      type: 'bar',
      barWidth: 50,
      data: [],
      barGap: 1,//
      itemStyle: { normal: { color: '#A52A2A' } },
    },
    {
      name: '预测净利润',
      type: 'bar',
      data: [],
      barGap: "-100%",
      barWidth: 50,
      itemStyle: {
        normal: {
          color: '#4169E1'
        },

      },
    },
    {
      name: '每股收益',
      type: 'line',
      yAxisIndex: 1,
      symbolSize: 10,
      data: [],
      itemStyle: {
        normal: { color: '#8B4513' }
      },
    },
    {
      name: '预测每股收益',
      type: 'line',
      yAxisIndex: 1,
      symbolSize: 10,
      data: [],
      itemStyle: {
        normal: { color: '#48D1CC' }
      },
    }
  ]
};
export default { option };