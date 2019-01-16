import React from 'react';
import './KeyBoardOrigin.less'
import {connect} from 'react-redux';
import { CompBaseClass } from "@/utils/BaseTools.js";
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { Icon, Input } from 'antd';
import {add, del, controller, update} from '@/actions';
import _uniq from 'lodash/uniq';
import {assetTypeConfig, securityTypeConfig, exchangeTypeConfig} from '@/components/lists/otherConfig';
import historyRoute from '@/utils/history.js';

/* ***********
data sample

area : null
asset : 6
ccyCode : "CNY"
codeNumber : 136775
digit : 2
exchange : "SH"
industry : null
priceStep : 2
securityType : 6
stockCode : "136775"
stockName : "16中船02"
stockStatus : 2
subnew : 0
tradflag : 0
unit : 100
uuid : "SH.136775"
 * **********/

export function canSearch(reg, item){
  // 判断是否可以搜索, 拼音处理
  let dhdiv = item.split(',');
  if(dhdiv.length === 1){
    return reg.test(item);
  }else{
    return dhdiv.some(item => reg.test(item));
  }
}

export function searchCodelist(inputVal, searchNum){
  let reg = new RegExp(inputVal.split('').join('.*'), 'i');
  let reg_pre = new RegExp(`^${inputVal}.*`, 'i');
  let ans = [], ans_pre = [], data;
  window.codelist && window.codelist.keys.every(key => {
    let item = key.split('-')[0];
    let canRun = canSearch(reg, item);
    if(ans.length <= searchNum && canRun){
      data = window.codelist.data[key];
      if(data.constructor === String){
        ans.indexOf(key) === -1 && ans.push(data)
      }else{
        ans.push(key);
      }
    }
    canRun = canSearch(reg_pre, item);
    if(reg_pre.test(item) && canRun){
      data = window.codelist.data[key];
      if(data.constructor === String){
        ans_pre.indexOf(key) === -1 && ans_pre.push(data)
      }else{
        ans_pre.push(key);
      }
    }
    return ans_pre.length < searchNum;
  })
  return _uniq([...ans_pre, ...ans]).slice(0, 10);
}

class KeyBoardOrigin extends CompBaseClass{
  constructor(props){
    super(props);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.searchNum = 10;
    this.inputVal = '';
    this.handleTimer;
    this.select = 0;
    this.clickHandle = this.clickHandle.bind(this);
    this.onChangeHandle = this.onChangeHandle.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  state = {
    suggestions: [],
    searchVal: '',
    searchPanel: [],
  }


  onChange(e, nextIsShowKeyBoard){
    try{
      this.onChangeHandle(e.target.value, nextIsShowKeyBoard);
    }catch(err){
      console.log('weberror: 按键精灵输入错误: ', e.target.value)
    }
  }

  onChangeHandle(inputVal, nextIsShowKeyBoard){
    // 输入值发生变化时的处理函数
    if(inputVal === '' && (this.props.isShowKeyBoard || nextIsShowKeyBoard)){
      this.handleTimer = Date.now();
      let handleTimer = this.handleTimer, self = this, execed;
      execed = setTimeout(() => {
        if(handleTimer === self.handleTimer && self.inputNode && self.inputNode.input && self.inputNode.input.value === ''){
          self.props.isShowKeyBoard && (self.props.controller({isShowKeyBoard: false}), self.setState({searchPanel: []}))
        }
        clearTimeout(execed);
        execed = null;
      }, 3000);
      this.setState({searchPanel: []});
      return;
    }
    this.select = 0;
    this.setState({searchPanel: searchCodelist(inputVal, this.searchNum)});
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.isShowKeyBoard !== this.props.isShowKeyBoard && nextProps.isShowKeyBoard){
      this.onChange({target: {value: ''}}, nextProps.isShowKeyBoard);
    }
  }

  updateSelect(index){
    // 上下键选择搜索结果
    if(this.props.isShowKeyBoard && index !== this.select && index >= 0 && index + 1 <= this.state.searchPanel.length){
      this.select = index;
      this.$(`#${this.compId} .select`).forEach(ele => ele.classList.remove('select'));
      this.$(`#${this.compId} .searchItem`)[index].classList.add('select');
    }
  }

  onKeyPress(e) {
    // 按键输入的捕获与处理
    if(e.keyCode >= 112 && e.keyCode <= 123){
      e.preventDefault();
      switch(e.code){
        case 'F1': // 进入交易详细
          if(window.currentSelectItem.asset === 4) return ;
          this.props.controller({isShowPensDetail: true});
          break;
        case 'F3': // 上证指数
        case 'F4': // 深证成指
          let stockInfo = window.codelist.data[e.code];
          window.currentSelectItem = stockInfo;
          this.selectItem(e, stockInfo);
          break;
        case 'F5': // 日k与分时切换
          if(!this.props.isShowQuoteDetails) return;
          this.props.update({type: 'quoteDetailsData', updateArr: [{action: 'mainNext'}]});
          break;
        case 'F6': // 切换到自选页面
          if(this.props.isShowQuoteDetails){
            this.props.controller({isShowQuoteDetails: false});
          }
          historyRoute.push('/quotes/optionalStock');
          break;
        case 'F10': // 切换到f10
          if(this.props.isShowQuoteDetails){
            this.props.controller({f10Data: this.props.quoteDetailsData})
            historyRoute.push('/quotes/stockF10/transactionRule/' + this.props.quoteDetailsData.uuid);
          }else if(window.currentSelectItem){
            this.props.controller({f10Data: window.currentSelectItem})
            historyRoute.push('/quotes/stockF10/transactionRule/' + window.currentSelectItem.uuid);
          }
          break
        case 'F8': // 详情页显示类型切换
          if(!this.props.isShowQuoteDetails) return;
          this.props.update({type: 'quoteDetailsData', updateArr: [{action: 'cycleNext'}]});
          break
      }
      return;
    }
    if(!window.canKeyBoard)return;
    if((e.keyCode >= 48 && e.keyCode <= 57)
      || (e.keyCode >= 65 && e.keyCode <= 90)
      || (e.keyCode >= 96 && e.keyCode <= 105)
      || [27, 13, 38, 40].indexOf(e.keyCode) > -1
    ){
      switch(e.keyCode){
        case 27:
          // Esc按键, 如果键盘精灵打开则关闭键盘精灵, 否则关闭交易详细或详情页, 一次只能关闭一个
          if(this.props.isShowKeyBoard){
            this.props.controller({isShowKeyBoard: false});
            this.setState({searchPanel: []});
          }else if(this.props.isShowPensDetail){
            this.props.controller({isShowPensDetail: false});
          }else if(this.props.isShowQuoteDetails){
            this.props.controller({isShowQuoteDetails: false});
          }
          break;
        case 13:
          // 回退键
          if(!this.props.isShowKeyBoard || this.state.searchPanel.length === 0)return;
          this.selectItem(e, window.codelist.data[this.state.searchPanel[this.select]]);
          break;
        case 38:
          this.updateSelect(this.select - 1);
          break;
        case 40:
          this.updateSelect(this.select + 1);
          break;
        default:
          if(this.props.isShowKeyBoard)return;
          //this.inputVal = e.key;
          !this.props.isShowKeyBoard && this.props.controller({isShowKeyBoard: true});
      }
    }
  }

  componentDidUpdate(prevProps){
    if(!prevProps.isShowKeyBoard && this.props.isShowKeyBoard){
      this.inputNode.focus();
      if(this.inputVal !== ''){
        this.inputNode.input.value = this.inputVal;
        this.onChange({target: {value: this.inputNode.input.value}});
        this.inputVal = '';
      }
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyPress);
    document.addEventListener('click', this.clickHandle);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyPress);
    document.removeEventListener('click', this.clickHandle);
  }

  clickHandle(e){
    if(this.props.isShowKeyBoard && !document.getElementById(this.compId).contains(e.target) && !e.target.classList.contains('isAddOption')){
      this.props.controller('isShowKeyBoard');
    }
  }

  selfOptionHandle(type, data, e){
    e.stopPropagation();
    if(data.isNotDel){
      return;
    }
    this[type](data)
    e.target.classList.toggle('anticon-plus-circle-o');
    e.target.classList.toggle('anticon-minus-circle-o');
  }

  selectItem(e, data){
    // 回车选中事件处理
    e.stopPropagation();
    switch(data.type){
      case 'tool-func':
        data.callBack && data.callBack(data);
        break;
      case 'tool-action':
        if(!this.props.isShowQuoteDetails) return;
        this.props.update({type: 'quoteDetailsData', updateArr: [{action: data.stockCode}], isShowPensDetail: false});
        break;
      default:
        if((historyRoute.location.pathname.indexOf('stockF10')) > -1){
          const F10PAGEARR = ['aboutUs','dividendFinancing','F10NewsListMore','financialCapitalManagement','industryTopics','shareHolders','transactionRule','valuationForecast']
          F10PAGEARR.map(item => {
            if((historyRoute.location.pathname).indexOf(item) > -1){
              historyRoute.replace(`${data.uuid}`);
            }
          })
          this.props.controller({f10Data: data})
        }else{
          this.props.controller({isShowQuoteDetails: true, quoteDetailsData: data, isShowPensDetail: false});
        }
       
    }
    this.props.isShowKeyBoard && (this.props.controller({isShowKeyBoard: false}), this.setState({searchPanel: []}));
  }

  getStockType(data){
    // 返回股票类型
    if(data.type || (data.asset === 0 && [0, 1, 16, 17].indexOf(data.securityType) > -1)){
      return securityTypeConfig[data.securityType];
    }else if(this.isLegal(data.exchange) || this.isLegal(data.asset)){
      return `${exchangeTypeConfig[data.exchange] || ''}${assetTypeConfig[data.asset] || ''}`;
    }
    return '其它';
  }

  render(){
    if(!this.props.isShowKeyBoard)return '';
    return (
      <div
        id={this.compId}
        className='KeyBoardOrigin'>
        <div className="searchPanel">
          {
            this.state.searchPanel.length > 0?
              <div className="searchTip">显示搜索结果前十条</div>:
              <div className="notSearchTip">{window.codelist? '未找到匹配项': '码表正在加载中...'}</div>
          }
          {
            this.state.searchPanel.map((key, index) => {
              let data = window.codelist.data[key], isNotDel;
              let sindex = window.selfOptions.findIndex(item => item.uuid === data.uuid);
              if(sindex > -1){
                isNotDel = window.selfOptions[sindex].isNotDel;
              }
              let stockType = this.getStockType(data);
              return (
                <div
                  className={`searchItem ${index === this.select && 'select'} ${data.type && 'keyBoardTool'}`}
                  key={index}
                  onClick={e => this.selectItem(e, data)}
                >
                  <div className="stockCode" title={data.stockCode} >{data.stockCode}</div>
                  <div className="stockName" title={data.stockName} >{data.stockName}</div>
                  <div className="exchange" title={stockType} >{stockType}</div>
                  <div className={`stockIcon ${isNotDel && 'notUse' || ''}`}>
                    {
                      window.selfOptions && !data.type && (window.selfOptions.findIndex(item => item.uuid === data.uuid) > -1?
                        <Icon onClick={e => this.selfOptionHandle('delSelfOption', {...data, isNotDel}, e)} type="minus-circle-o" />:
                        <Icon onClick={e => this.selfOptionHandle('addSelfOption', {...data, isNotDel}, e)} type="plus-circle-o" />)
                    }
                  </div>
                </div>
              )
            })
          }
        </div>
        <Input
          suffix={<Icon type="close-circle-o" onClick={(e) => this.onKeyPress({keyCode: 27})} />}
          size="small"
          ref={node => this.inputNode = node}
          onChange={e => this.onChange(e)}
          placeholder="代码/汉字/拼音首字母" />
      </div>
    )
  }
}

export default connect(
  state => ({
    data: state.Data,
    isShowKeyBoard: state.DisplayController.isShowKeyBoard,
    isShowQuoteDetails: state.DisplayController.isShowQuoteDetails,
    isShowPensDetail: state.DisplayController.isShowPensDetail,
    quoteDetailsData: state.DisplayController.quoteDetailsData,
  }), {add, del, controller, update}
)(KeyBoardOrigin);
