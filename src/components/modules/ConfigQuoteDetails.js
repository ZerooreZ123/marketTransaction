/* *****************
 * List: 行情列表
 *   HSGP: 沪深股票
 *     Chart: 图表
 *       ShZZS: 上证指数
 *       SzZZS: 深证指数
 *       CYBZS: 创业版指数
 *       FS: 分时
 *       KX: K线
 * ****************/
import {quoteDetailColumn, quoteDetailColumnHs,quoteDetailColumnGL,comprehensivePlateColumn} from './TableColumn.js';

const configBox = {};

configBox.DetailChart = {
  compType: 'chart',
  actionName: 'stockIndex',
}
configBox.DetailChart = {
  compType: 'chartDetail',
  actionName: 'stockIndex',
}

configBox.DetailNewsLeft = {
  compType: 'news',
  actionName: 'newslist',
  newsProps: {
    title: '新闻',
    columns: {
      'newslist': ['pub_time', 'tit'],
    }
  }
}

configBox.DetailNewsRight = {
  compType: 'news',
  actionName: 'newslist',
  newsProps: {
    title: '公告',
    columns: {
      'newslist': ['pub_time', 'tit'],
    }
  }
}


configBox.DetailTableZS = {
  compType: 'table',
  actionName: 'count',
  autoWidth: true,
  tableProps: {
    RNFlag: 'stockCode',
    defaultSort: 'netChangeRatio_desc',
    columns: quoteDetailColumn,
  }
}

configBox.DetailTableZSHs = {
  compType: 'table',
  actionName: 'count',
  autoWidth: true,
  tableProps: {
    RNFlag: 'stockCode',
    defaultSort: 'turnoverRatio_desc',
    columns: quoteDetailColumnHs,
  }
}

configBox.DetailTableGLBJ = {
  compType: 'table',
  actionName: 'glbj-ALL',
  autoWidth: false,
  tableProps: {
    isHeader: true,
    RNFlag: 'stockCode',
    tableType: 'one',
    defaultSort: 'close_desc',
    columns: quoteDetailColumnGL,
  }
}

configBox.DetailTableGLBJ2 = {
  compType: 'table',
  actionName: 'count',
  autoWidth: true,
  tableProps: {
    isHeader: true,
    RNFlag: 'stockCode',
    defaultSort: 'netChangeRatio_desc',
    columns: comprehensivePlateColumn,
  }
}
export default configBox;
