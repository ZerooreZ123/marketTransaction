import React, { Component } from 'react';
import './PanelOrigin_su.less';
import { Button, Select, Switch } from 'antd';

class PanelOrigin extends Component{
  constructor(props){
    super(props);
  }

  componentDidMount() {
  }

  render(){
    const {data, lineComps} = this.props;
    const lines = Math.ceil(data.length / lineComps); // 行数
    // const lastLineComps = data.length - Math.floor(data.length / lineComps) * lineComps; // 最后一样组件数量
    return(
      <div
        className="panelOrigin_su">
        <div
          onMouseDown={this.props.panelMouseDown}
          onMouseUp={this.props.panelMouseUp}
          className="panelTitle">
          操作台
        </div>
        <div className="panelSmallTitle">操作按钮</div>
        <div className="handleBody">
          <Button
            onClick={() => this.props.saveConfig()}
            type="primary"
            size="small"
            ghost>
            保存
          </Button>
          <Switch
            checkedChildren="拖拽"
            unCheckedChildren="自定义"
            defaultChecked />
          <Select style={{ width: 100 }} size="small" defaultValue="平面模型" className="boxRange">
            {
              Array(5).fill(0).map((ii, i) => {
                if(i < 1)return '';
                return (
                  Array(4).fill(0).map((jj, j) => {
                    if(j < 1)return '';
                    return (
                      <Select.Option value={`${i + 1} * ${j + 1}`}>{`${i + 1} * ${j + 1}`}</Select.Option>
                    )
                  })
                )
              })
            }
          </Select>
        </div>
        <div className="panelSmallTitle">组件仓库</div>
        <div className="panelBody">
          {
            data.length > 0 && lines && Array(lines).fill(0).map((xx, i) => {
              return (
                <div className="lineBox">
                  {
                    Array(lineComps).fill(0).map((yy, j) => {
                      let item = data[i * lineComps + j];
                      if(item === undefined){
                        return <div className="itemBox"></div>;
                      }
                      return (
                        <div
                          className="itemBox">
                          <div
                            draggable="true"
                            onDragStart={(e) => this.props.panelDragStart(e, item)}
                            onDragEnd={(e) => this.props.panelDragEnd(e)}
                            className="itemBody">
                            {`${item.xn} * ${item.yn}`}
                          </div>
                          <div className="itemTitle">{item.title}</div>
                        </div>
                      )
                    })
                  }
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}
export default PanelOrigin;
