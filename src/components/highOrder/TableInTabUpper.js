import React,{Component} from 'react';
import {Menu, Dropdown, Icon} from 'antd';
import './TableInTabUpper.less';

export default class NewComponent extends Component{
    constructor(props){
      super(props);
      let state = {
        actionName: null,
        hiddenItemIndex: []
      }
      if(!props.tabMap){
        state.actionName = props.actionName[0];
      }else{
        props.tabTitle.some((title, index) => {
          if(!props.tabMap[props.actionName[index]]){
            state.actionName = props.actionName[index];
            return true;
          }
        })
      }
      this.state = state;
      this.calcMoreItem = this.calcMoreItem.bind(this);
    }

    componentDidMount(){
      this.calcMoreItem();
      window.addEventListener('resize', this.calcMoreItem);
    }

    calcMoreItem(){
      let boxWidth = document.querySelector('.tabUpper').clientWidth, itemWidth, itemWidthSum = 0, index = [];
      for(var items = document.querySelectorAll('.menuItem'), n = items.length, i = 0; i < n; i++){
        itemWidth = items[i].offsetWidth;
        if(itemWidth + itemWidthSum + i > boxWidth){
          index.push(i);
        }else{
          itemWidthSum += itemWidth;
        }
      }
      this.setState({hiddenItemIndex: index});
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.calcMoreItem);
    }

    menuitemClick(item){
      this.setState({actionName: item.action});
    }

    render(){
      const Comp = this.props.comp;
      return (
        <div
          className="tableInTabUpper"
          style={{width: '100%', height: '100%'}}>
          <div className="wrapped">
            {
              this.state.actionName &&
              <Comp
                {...this.props}
                actionName={this.state.actionName}
              />
            }
          </div>
          <div className="tabUpper">
            {
              this.props.tabTitle.map((title, index) => {
                let actionName = this.props.actionName[index];
                let moreItem = this.props.tabMap && this.props.tabMap[actionName] || undefined;
                if(!moreItem){
                  return (
                    <div
                      className={`menuItem ${actionName === this.state.actionName? 'active': ''}`}
                      key={actionName}
                      onClick={() => this.menuitemClick({action: actionName, title})}>
                      {title}
                    </div>
                  )
                }else{
                  if(moreItem.type === 'dropdown'){
                    let menu = (
                      <Menu>
                        {
                          moreItem.data.map(item => {
                            if(item.subMenu){
                              return (
                                <Menu.SubMenu title={item.title} key={item.action}>
                                  {
                                    item.subMenu.map(subItem => {
                                      return (
                                        <Menu.Item
                                          key={subItem.action}
                                          onClick={() => this.menuitemClick(subItem)}>
                                          {subItem.title}
                                        </Menu.Item>
                                      )
                                    })
                                  }
                                </Menu.SubMenu>
                              )
                            }else{
                              return (
                                <Menu.Item
                                  onClick={() => this.menuitemClick(item)}
                                  key={item.action}>
                                  {item.title}
                                </Menu.Item>
                              )
                            }
                          })
                        }
                      </Menu>
                    )
                    return (
                      <Dropdown placement="topLeft" overlay={menu}>
                        <div className="menuItem">
                          {title} <Icon type="down" />
                        </div>
                      </Dropdown>
                    )
                  }else if(moreItem.type === 'handler'){
                    return (
                      <div
                        className={`menuItem ${actionName === this.state.actionName? 'active': ''}`}
                        {...moreItem.onHandler}
                        key={actionName}>
                        {title}
                      </div>
                    )
                  }
                }
              })
            }
            {
              this.state.hiddenItemIndex.length > 0 &&
                <Dropdown placement="topLeft" overlay={
                  <Menu>
                    {
                      this.state.hiddenItemIndex.map(index => {
                        let actionName = this.props.actionName[index];
                        let title = this.props.tabTitle[index];
                        return (
                          <Menu.Item
                            onClick={() => this.menuitemClick({action: actionName, title})}
                            key={actionName} >
                            {title}
                          </Menu.Item>
                        )
                      })
                    }
                  </Menu>
                }>
                  <div className="menuMore">
                    更多 <Icon type="down" />
                  </div>
                </Dropdown>
            }
          </div>
        </div>
      )
    }
};
