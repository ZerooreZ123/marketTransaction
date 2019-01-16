import React from 'react';
import {connect} from 'react-redux';
import { CompBaseClass } from "@/utils/BaseTools.js";
import {add, del, controller, update} from '@/actions';
import './AddOptionPanelOrigin.less';
const uuid = require('uuid/v1');

class TabInteractive extends CompBaseClass{
  constructor(props){
    super(props);
    this.uuid = uuid();
    this.preuuid = null;
    this.eventMap = {
      'option-add': 'addSelfOption',
      'option-remove': 'delSelfOption'
    }
  }

  componentDidMount() {
    let self = this;
    window.addEventListener("storage", ev => {
      if(self.eventMap[ev.key]){
        if(!ev.newValue)return;
        var data = JSON.parse(ev.newValue);
        if(!data.uuid || data.app_uuid === window.superMonitor.app_uuid)return;
        self[self.eventMap[ev.key]](data, 1);
      }
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  render() {
    return '';
  }
}

TabInteractive = connect( state => ({displayController: state.DisplayController}), {add, del, controller, update})(TabInteractive);

class AddOptionPanelOrigin extends CompBaseClass{
  constructor(props){
    super(props);
    this.state = {};
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  handles(e, type){
    let tarEle = this.$(`#${window.currentSelfOption.compId} .TbodyInner .stockName`)[window.currentSelfOption.addOptionIndex];
    switch(type){
      case 'addSelfOption':
        this.addSelfOption(window.currentSelfOption);
        //tarEle.classList.add('is-my-stock');
        break;
      case 'getInfo':
        this.props.controller({isShowQuoteDetails: true, quoteDetailsData: window.currentSelfOption});
        this.$('.is-my-stock').forEach(ele => tarEle.textContent === ele.textContent && !ele.classList.contains('option') && ele.classList.remove('is-my-stock'));
        break;
      case 'delSelfOption':
        this.delSelfOption(window.currentSelfOption);
        //this.$('.is-my-stock').forEach(ele => tarEle.textContent === ele.textContent && !ele.classList.contains('option') && ele.classList.remove('is-my-stock'));
        break;
    }
  }

  render(){
    return (
      <div className="menuList" style={{display: 'none'}}>
        <TabInteractive />
        <ul>
          <li className="add" onClick={(e) => this.handles(e, 'addSelfOption')}>添加自选</li>
          <li className="del" onClick={(e) => this.handles(e, 'delSelfOption')}>删除自选</li>
          <li onClick={(e) => this.handles(e, 'getInfo')}>查看详情</li>
        </ul>
      </div>
    )
  }
}

AddOptionPanelOrigin.propTypes = {
}

AddOptionPanelOrigin.defaultProps = {
  menuLeft: 0,
  menuTop: 0
}

export default connect(
  null, {add, del, controller}
)(AddOptionPanelOrigin);
