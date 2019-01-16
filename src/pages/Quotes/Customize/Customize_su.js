import React, { Component } from 'react';
import cloneDeep from "lodash/cloneDeep";
import { Resource } from '@/utils/resource';
import CompPanel from '@/components/modules/CompPanel_su';
import {resData, plugins} from '@/config/customize_config';
import {message, Icon} from 'antd';
import './Customize_su.less';

/* 数据格式说明
 * oneWidth: 单位模块宽
 * oneHeight: 单位模块高
{
}
*/

class Customize extends Component {
  constructor(props){
    super(props);
    this.panelMouseMove = this.panelMouseMove.bind(this)
    this.drawBoard = this.drawBoard.bind(this);
    this.drawPanel = this.drawPanel.bind(this);
  }

  state = {
    boxRange: [], // 自定义面板容器范围, 单元倍数比值
    gap: 10, // 组件间缝隙
    boxWidth: 0, // 自定义面板容器px宽度
    boxHeight: 0, // 自定义面板容器px高度
    oneWidth: 0, // 最小单元px宽度
    oneHeight: 0, // 最小单元px高度
    resData: [], // 自定义面板数据
    panelData: [], // 操作面板数据
    panelLeft: '0px',
    panelTop: '0px',
    showMask: false,
    mode: 'drag',
    colorMap: (new Array(20)).fill(false),
    virColorMap: []
  }
  resDataSpace = [];
  currentDragIndex = -1;
  times = 0;
  swapItem = false;

  componentDidMount(){
    this.drawBoard();
    this.drawPanel();
    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize.bind(this));
  }

  onWindowResize(){
    let now = Date.now();
    if(now > this.times)this.times = now
    setTimeout(() => {
      if(now === this.times){
        this.setState(prevState => {
          let {clientWidth: boxWidth, clientHeight: boxHeight} = this.refs.mainBox;
          let [oneWidth, oneHeight] = [parseInt(boxWidth / prevState.boxRange[0]), parseInt(boxHeight / prevState.boxRange[1])];
          return {...prevState, oneWidth, oneHeight};
        });
      }
    }, 200);
  }

  drawPanel(){
    //Resource.customize_all.get().then(res => {
    //  console.log(plugins, resData);
    //  debugger;
    //  this.setState({panelData: res.data.data});
    //});
    this.setState({panelData: resData[3].data});
  };

  drawBoard(){
    // 获取数据生成面板
    const config = localStorage.getItem('customize:config') || undefined;
    if(config){
      let {resData: resDataLocal, boxRange, mapFlag} = JSON.parse(config);
      this.mapFlag = mapFlag;
      if(resDataLocal && boxRange && resDataLocal.length > 0 && boxRange.length === 2){
        this.setState(prevState => {
          let {clientWidth: boxWidth, clientHeight: boxHeight} = this.refs.mainBox;
          let [oneWidth, oneHeight] = [parseInt(boxWidth / boxRange[0]), parseInt(boxHeight / boxRange[1])];
          return {resData: resDataLocal, boxRange, boxWidth, boxHeight, oneHeight, oneWidth};
        }, _ => {
          this.init({resData: resDataLocal, areaMap: true, colorMap: true})
        })
        return;
      }
    }
    //Resource.customize.get().then(res => {
      var {screen: boxRange, data} = resData[resData.length - 1];
      let {clientWidth: boxWidth, clientHeight: boxHeight} = this.refs.mainBox;
      let [oneWidth, oneHeight] = [parseInt(boxWidth / boxRange[0]), parseInt(boxHeight / boxRange[1])];
      console.log('容器宽:', boxWidth, ' 容器高:', boxHeight, ' 单个宽:', oneWidth, ' 单个高:', oneHeight);
      var mapFlag = [-1,];
      // 棋盘初始化
      for(var i = 0; i < boxRange[0] * 2; i++){
        let tmpx = [-1, ];
        for(var j = 0; j< boxRange[1] * 2; j++){
          tmpx.push(-1);
        }
        mapFlag.push(tmpx);
      }
      this.mapFlag = mapFlag;
      // 根据棋盘定义数据
      let resDataArr = [];
      for(var boardY = 1; boardY <= boxRange[1]; boardY++){
        for(var boardX = 1; boardX <= boxRange[0]; boardX++){
          // boardX, boardY 面板坐标
          if(mapFlag[boardX][boardY] === -1){
            var maxX = 1, maxY = boxRange[1] - boardY + 1, index;
            // maxX, maxY 边界值
            for(index = boardX + 1; index <= boxRange[0]; index++){
              if(mapFlag[index][boardY] === -1){
                maxX += 1;
              }else{
                break;
              }
            }
            for(index = 0; index < data.length; index++){
              if(data[index].xn <= maxX && data[index].yn <= maxY){
                // 查询数据并导入
                let item = data.splice(index, 1)[0];
                console.log(item.title);
                item.htmlWidth = `${item.xn * 100 / boxRange[0]}%`;
                item.htmlHeight = `${item.yn * 100 / boxRange[1]}%`;
                item.area = item.xn * item.yn; // 模块在棋盘中的面积
                item.boardX = boardX; // 棋盘坐标x
                item.boardY = boardY; // 棋盘坐标y
                item.boardDiagX = item.boardX + item.xn; // 棋盘对角坐标x
                item.boardDiagY = item.boardY + item.yn; // 棋盘对角坐标y
                resDataArr.push(item);
                for(var m = boardX; m < item.boardDiagX; m++){
                  for(var n = boardY; n < item.boardDiagY; n++){
                    mapFlag[m][n] = resDataArr.length - 1;
                  }
                }
                index--;
                break;
              }
            }
            if(index === data.length){
              mapFlag[boardX][boardY] = false;
            }
          }
        }
      }
      console.log(this);
      this.setState({resData: resDataArr, oneWidth, oneHeight, boxRange, boxWidth, boxHeight }, () => {
        this.init({resData: this.state.resData, areaMap: true, colorMap: true})
      });

      /* 根据数据定义棋盘
      var mapFlag = {};
      mapFlag.edgex = 1; // x轴边缘
      mapFlag.edgey = 1; // y轴边缘
      mapFlag.flag = [0]; // 平面棋盘
      // 棋盘初始化
      for(let i = 0; i < boxRange[0]; i++){
        let tmpx = [0, ];
        for(let j = 0; j< boxRange[1]; j++){
          tmpx.push(false);
        }
        mapFlag.flag.push(tmpx);
      }
      data.map((item, index) => {
        if(mapFlag.edgex > boxRange[0]){
          // 当棋盘碰触x轴边缘, 棋盘换行
          mapFlag.edgex = 1;
          mapFlag.edgey += 1;
        }
        while(mapFlag.flag[mapFlag.edgex][mapFlag.edgey] !== false){
          // 检测坐标是否已经被占位
          mapFlag.edgex += 1;
          if(mapFlag.edgex > boxRange[0]){
            // 当棋盘碰触x轴边缘, 棋盘换行
            mapFlag.edgex = 1;
            mapFlag.edgey += 1;
          }
        }
        item.htmlWidth = `${parseInt(item.xn * 100 / boxRange[0])}%`;
        item.htmlHeight = `${parseInt(item.yn * 100 / boxRange[1])}%`;
        item.area = item.xn * item.yn; // 模块在棋盘中的面积
        item.boardX = mapFlag.edgex; // 棋盘坐标x
        item.boardY = mapFlag.edgey; // 棋盘坐标y
        item.boardDiagX = item.boardX + item.xn; // 棋盘对角坐标x
        item.boardDiagY = item.boardY + item.yn; // 棋盘对角坐标y
        // 模块在棋盘占位
        for(let i = 0; i < item.xn; i++){
          for(let j = 0; j < item.yn; j++){
            mapFlag.flag[mapFlag.edgex + i][mapFlag.edgey + j] = index + 1;
          }
        }
        // x轴边缘扩大
        mapFlag.edgex += item.xn;
      })
      console.log(data, oneWidth, oneHeight);
      this.setState({resData: data, oneWidth, oneHeight, boxRange, boxWidth, boxHeight }, () => {
        this.init({resData: data, areaMap: true})
      });
      */
    //})
  }

  init({resData, areaMap, colorMap}){
    console.log('初始化resData', resData, ', areaMap: ', areaMap, ', colorMap: ', colorMap);
    if(areaMap){
      this.areaMap = {
        item: [], // 符合条件的模块
        area: 0, // 符合条件模块的总面积
        originX: 0, // 存放拖动结束目标模块的X轴坐标
        originY: 0, // 存放拖动结束目标模块的Y轴坐标
        chreeMap: {}
      }
    }
    if(colorMap){
      this.setState({
        colorMap: (new Array(20)).fill(false),
        virColorMap: (new Array(this.state.boxRange[0] * this.state.boxRange[1])).fill('')
      });
    }
    if(resData){
      for(var i = 1; i <= this.state.boxRange[0]; i++){
        for(var j = 1; j <= this.state.boxRange[1]; j++){
          this.mapFlag[i][j] = false;
        }
      }
      resData.map((item, index) => {
        if(item.boardX){
          item.htmlWidth = `${parseInt(item.xn * 100 / this.state.boxRange[0])}%`;
          item.htmlHeight = `${parseInt(item.yn * 100 / this.state.boxRange[1])}%`;
          item.area = item.xn * item.yn; // 模块在棋盘中的面积
          item.boardDiagX = item.boardX + item.xn; // 棋盘对角坐标x
          item.boardDiagY = item.boardY + item.yn; // 棋盘对角坐标y
          for(var x = item.boardX; x < item.boardDiagX; x++){
            for(var y = item.boardY; y < item.boardDiagY; y++){
              this.mapFlag[x][y] = index;
            }
          }
        }
      })
    }
  }

  dragStartHandle(e, data){
    if(data instanceof Object){
      this.currentPanelInfo = data;
      this.currentDragIndex = -1;
    }else{
      this.currentDragIndex = data;
      this.currentPanelInfo = -1;
    }
    console.log('dragStartHandle');
    //e.dataTransfer.setDragImage(e.target);
    this.setState({showMask: true});
    return true;
  }

  dragEndHandle(e){
    console.log('e: dragEndHandle');
    this.currentDragIndex = -1;
    this.currentPanelInfo = -1;
    this.setState({showMask: false});
    this.init({colorMap: true});
    return true;
  }

  dragOverHandle(e, index){
    e.preventDefault();
  }

  dragEnterHandle(e, index, indey){
    e.preventDefault();
    console.log('e: dragEnterHandle');
    if(indey === undefined && index === this.currentDragIndex)return;
    // 移入时做可行性判断
    this.swapItem = this.getSwap(index, indey);
    console.log(this.swapItem);
    this.init({colorMap: true});
    if(this.swapItem !== false){
      this.setState(prevState => {
        prevState.colorMap = (new Array(20)).fill(false);
        this.swapItem.forEach(coor => {
          if(!coor[2]){
            prevState.colorMap[this.mapFlag[coor[0]][coor[1]]] = "red";//"rgba(0, 0, 0, .6)";
          }else{
            prevState.virColorMap[(coor[0] - 1) + (coor[1] - 1) * prevState.boxRange[0]] = 'red';
          }
        })
        return prevState;
      });
    }
  }

  getSwap(index, indey){
    let originEle, targetEle;
    if(indey === undefined){
      targetEle = {...this.state.resData[index]};
    }else{
      targetEle = this.grenterVirtualItem(index, indey);
    }
    if(this.currentDragIndex === -1){
      originEle = cloneDeep(this.currentPanelInfo);
    }else{
      if(indey === undefined && index === this.currentDragIndex)return false;
      originEle = cloneDeep(this.state.resData[this.currentDragIndex]);
    }
    if(originEle.xn >= targetEle.xn && originEle.yn >= targetEle.yn){
      console.log('源模块覆盖目标模块');
      this.areaMap = {...this.areaMap, originX: targetEle.boardX, originY: targetEle.boardY}; // 更新符合的已知模块边缘最大坐标值
      this.getMoveItem(targetEle, originEle);
      let areaMap = cloneDeep(this.areaMap);
      this.init({areaMap: true});
      if(areaMap.area === originEle.xn * originEle.yn){
        console.log(1, areaMap);
        return areaMap.item;
      }
    }
    if(this.currentDragIndex !== -1 && (originEle.boardX === targetEle.boardX || originEle.boardY === targetEle.boardY)){
      // 方向
      console.log('源模块与目标模块同行或同列');
      let direction = originEle.boardX === targetEle.boardX ? 'boardY': 'boardX';
      let startCoor, endCoor;
      if(direction === 'boardX'){
        if(originEle.boardX < targetEle.boardX){
          // 源模块在目标模块左边
          startCoor = [originEle.boardDiagX, originEle.boardY];
          endCoor = [targetEle.boardDiagX, originEle.boardDiagY];
        }else{
          // 源模块在目标模块右边
          startCoor = [targetEle.boardX, targetEle.boardY];
          endCoor = [originEle.boardX, originEle.boardDiagY];
        }
      }else{
        if(originEle.boardY < targetEle.boardY){
          // 源模块在目标模块上边
          startCoor = [originEle.boardX, originEle.boardDiagY];
          endCoor = [originEle.boardDiagX, targetEle.boardDiagY];
        }else{
          // 源模块在目标模块下边
          startCoor = [targetEle.boardX, targetEle.boardY];
          endCoor = [originEle.boardDiagX, originEle.boardY];
        }
      }
      return this.canSwap(direction, startCoor, endCoor);
    }
    console.log('不符合条件');
    return false;
  }

  getIndexSpace(resData){
    if(this.resDataSpace.length === 0){
      resData.push({});
      return resData.length - 1;
    }else{
      return this.resDataSpace.pop()
    }
  }

  dropHandle(e, index, indey){
    // 拖动完成触发事件, index为目标模块下标
    e.preventDefault();
    if(this.swapItem === false)return;
    let originEle, targetEle;
    if(indey === undefined){
      targetEle = cloneDeep(this.state.resData[index]);
    }else{
      targetEle = this.grenterVirtualItem(index, indey);
    }
    if(this.currentDragIndex === -1){
      // 操作面板移出来的模块
      originEle = cloneDeep(this.currentPanelInfo);
      this.swapItem.forEach(item => {
        if(item[2] === undefined){
          this.delItem(undefined, this.mapFlag[item[0]][item[1]]);
        }
      })
      this.setState(prevState => {
        if(indey === undefined){
          prevState.resData[index] = originEle;
          prevState.resData[index].boardX = targetEle.boardX;
          prevState.resData[index].boardY = targetEle.boardY;
        }else{
          let indexSpace = this.getIndexSpace(prevState.resData);
          prevState.resData[indexSpace] = originEle;
          prevState.resData[indexSpace].boardX = index;
          prevState.resData[indexSpace].boardY = indey;

        }
        this.init({resData: prevState.resData, colorMap: true});
        return prevState;
      }, _ => {
        this.dragEndHandle();
      })
    }else{
      // 面板容器内模块的移动
      if(indey === undefined && index === this.currentDragIndex)return false;
      originEle = cloneDeep(this.state.resData[this.currentDragIndex]);
      let areaSum = 0;
      this.swapItem.forEach(item => {
        if(item[2]){
          areaSum += 1;
        }else{
          areaSum += this.state.resData[this.mapFlag[item[0]][item[1]]].area;
        }
      });
      var moveX, moveY;
      if(originEle.area !== areaSum){
        this.setState(prevState => {
          let direction = originEle.boardX === targetEle.boardX ? 'boardY': 'boardX';
          let moveWidth = 0;
          if(direction === 'boardX'){
            if(originEle.boardX < targetEle.boardX){
              // 源模块在目标模块左边
              this.swapItem.forEach(item => {
                if(item[2] === undefined){
                  prevState.resData[this.mapFlag[item[0]][item[1]]].boardX -= originEle.xn;
                  moveWidth += prevState.resData[this.mapFlag[item[0]][item[1]]].xn;
                }
              })
              prevState.resData[this.currentDragIndex].boardX += (targetEle.boardDiagX - originEle.boardDiagX)
            }else{
              // 源模块在目标模块右边
              this.swapItem.forEach(item => {
                if(item[2] === undefined){
                  prevState.resData[this.mapFlag[item[0]][item[1]]].boardX += originEle.xn;
                  moveWidth += prevState.resData[this.mapFlag[item[0]][item[1]]].xn;
                }
              })
              prevState.resData[this.currentDragIndex].boardX -= (originEle.boardX - targetEle.boardX);
            }
          }else{
            if(originEle.boardY < targetEle.boardY){
              // 源模块在目标模块上边
              this.swapItem.forEach(item => {
                if(item[2] === undefined){
                  prevState.resData[this.mapFlag[item[0]][item[1]]].boardY -= originEle.yn;
                  moveWidth += prevState.resData[this.mapFlag[item[0]][item[1]]].yn;
                }
              })
              prevState.resData[this.currentDragIndex].boardY += (targetEle.boardDiagY - originEle.boardDiagY);
            }else{
              // 源模块在目标模块下边
              this.swapItem.forEach(item => {
                if(item[2] === undefined){
                  prevState.resData[this.mapFlag[item[0]][item[1]]].boardY += originEle.yn;
                  moveWidth += prevState.resData[this.mapFlag[item[0]][item[1]]].yn;
                }
              })
              prevState.resData[this.currentDragIndex].boardY -= (originEle.boardY - targetEle.boardY);
            }
          }
          this.init({resData: prevState.resData});
          return prevState;
        }, _ => {
          this.dragEndHandle();
        })
      }else{
        console.log('正常情况');
        moveX = this.state.resData[this.currentDragIndex].boardX - (indey === undefined? this.state.resData[index].boardX: index);
        moveY = this.state.resData[this.currentDragIndex].boardY - (indey === undefined? this.state.resData[index].boardY: indey);
        this.setState(prevState => {
          prevState.resData[this.currentDragIndex].boardX -= moveX;
          prevState.resData[this.currentDragIndex].boardY -= moveY;
          this.swapItem.forEach(item => {
            if(item[2] === undefined){
              let index = this.mapFlag[item[0]][item[1]]
              if(prevState.resData[this.currentDragIndex].area === areaSum){
                prevState.resData[index].boardX += moveX;
                prevState.resData[index].boardY += moveY;
              }else{
                prevState.resData[index].boardX += moveX === 0? 0: prevState.resData[this.currentDragIndex].xn * (moveX > 0? 1: -1);
                prevState.resData[index].boardY += moveY === 0? 0: prevState.resData[this.currentDragIndex].yn * (moveY > 0? 1: -1);
              }
            }
          });
          this.init({resData: prevState.resData});
          return prevState;
        }, _ => {
          this.dragEndHandle();
        });
      }
    }
  }

  canSwap(direction, startCoor, endCoor){
    let ans = new Set(), ele;
    for(var x = startCoor[0]; x < endCoor[0]; x++){
      for(var y = startCoor[1]; y < endCoor[1]; y++){
        ele = this.state.resData[this.mapFlag[x][y]];
        if(ele === undefined){
          ele = this.grenterVirtualItem(x, y);
        }
        if(ele.boardDiagX > endCoor[0] || ele.boardDiagY > endCoor[1] || ele.boardX < startCoor[0] || ele.boardY < startCoor[1])return false;
        ans.add(ele);
      }
    }
    return [...ans].map(item => [item.boardX, item.boardY, item.virtual])
  }

  grenterVirtualItem(boardX, boardY){
    return {
      xn: 1,
      yn: 1,
      boardX,
      boardY,
      area: 1,
      boardDiagX: boardX + 1,
      boardDiagY: boardY + 1,
      virtual: true
    }
  }

  getMoveItem(nowEle, originEle){
    // 递归找出可以替换时的目标替换模块
    let {area, originX, originY} = {...this.areaMap};
    let nowMaxX = nowEle.boardDiagX - originX;
    let nowMaxY = nowEle.boardDiagY - originY;
    if ((area + nowEle.area > originEle.area)
      || (nowMaxX > originEle.xn || nowMaxY > originEle.yn)){
      // 符合条件模块的面积和加当前模块的面积小于等于原模块的面积
      // 当前已选择模块与当前模块组成平面面积的最大边缘X与Y坐标要小于等于原模块的宽和高
      return;
    };
    if(!this.areaMap.chreeMap[`${nowEle.boardX}-${nowEle.boardY}`]){
      this.areaMap.item.push([nowEle.boardX, nowEle.boardY, nowEle.virtual]);
      this.areaMap.area += nowEle.area;
      this.areaMap.chreeMap[`${nowEle.boardX}-${nowEle.boardY}`] = true;
    }
    if(this.mapFlag[nowEle.boardX + nowEle.xn][nowEle.boardY] !== -1){
      let nextEle = this.state.resData[this.mapFlag[nowEle.boardX + nowEle.xn][nowEle.boardY]];
      if(nextEle === undefined){
        nextEle = this.grenterVirtualItem(nowEle.boardX + nowEle.xn, nowEle.boardY);
      }
      if(nextEle.boardX !== nowEle.boardX + nowEle.xn || nextEle.boardY !== nowEle.boardY){
      }else{
        this.getMoveItem(nextEle, originEle);
      }
    }
    if(this.mapFlag[nowEle.boardX][nowEle.boardY + nowEle.yn] !== -1){
      let nextEle = this.state.resData[this.mapFlag[nowEle.boardX][nowEle.boardY + nowEle.yn]];
      if(nextEle === undefined){
        nextEle = this.grenterVirtualItem(nowEle.boardX, nowEle.boardY + nowEle.yn);
      }
      if(nextEle.boardX !== nowEle.boardX || nextEle.boardY !== nowEle.boardY + nowEle.yn){
      }else{
        this.getMoveItem(nextEle, originEle);
      }
    }
  }

  panelMouseDown(e){
    this.isMouseDown = true;
    this.mouseTop = e.clientY - parseInt(this.refs.panelBox.style.top);
    this.mouseLeft = e.clientX - parseInt(this.refs.panelBox.style.left) - 80;
    window.addEventListener('mousemove', this.panelMouseMove, false);
  }

  panelMouseMove(e){
    e.preventDefault();
    if(this.isMouseDown){
      this.refs.panelBox.style.left = `${e.clientX - this.mouseLeft - 80}px`;
      this.refs.panelBox.style.top = `${e.clientY - this.mouseTop}px`;
    }
  }

  panelMouseUp(e){
    e.preventDefault();
    this.isMouseDown = false;
    window.removeEventListener('mousemove', this.panelMouseMove, false)
  }

  saveConfig(){
    localStorage.setItem('customize:config', JSON.stringify({
      mapFlag: this.mapFlag,
      resData: this.state.resData,
      boxRange: this.state.boxRange
    }));
    message.success('当前布局保存成功');
  }

  delItem(e, index){
    this.setState(prevState => {
      let data = prevState.resData[index];
      for(var boardX = data.boardX; boardX < data.boardDiagX; boardX++){
        for(var boardY = data.boardY; boardY < data.boardDiagY; boardY++){
          this.mapFlag[boardX][boardY] = false;
        }
      }
      prevState.resData[index] = {};
      this.resDataSpace.push(index);
      this.init({resData: prevState.resData});
      return prevState;
    })
  }

  getBiz(i, j, xn, yn){
    if(this.state.boxRange[0] + 1 - i < xn || this.state.boxRange[1] + 1 - j < yn){
      return false;
    }
    let biz = [];
    for(var boardX = 0; boardX < xn; boardX++){
      for(var boardY = 0; boardY < yn; boardY++){
        if(this.mapFlag[boardX + i][boardY + j] !== false){
          return false;
        }else{
          biz.push([boardX + i, boardY + j]);
        }
      }
    }
    return biz;
  }

  dropHandleSpace(e, i, j){
    // 虚拟模块拖动结束处理事件
    if(this.currentDragIndex !== -1){
      // 模块容器内模块拖动事件
      debugger;
      let oriEle = this.state.resData[this.currentDragIndex];
      let biz = this.getBiz(i, j, oriEle.xn, oriEle.yn);
      if(biz === false)return;
      biz.forEach(item => {
        this.mapFlag[item[0]][item[1]] = this.currentDragIndex;
      })
      for(var boardX = oriEle.boardX; boardX < oriEle.boardDiagX; boardX++){
        for(var boardY = oriEle.boardY; boardY < oriEle.boardDiagY; boardY++){
          this.mapFlag[boardX][boardY] = false;
        }
      }
      this.setState(prevState => {
        prevState.resData[this.currentDragIndex].boardX = i;
        prevState.resData[this.currentDragIndex].boardY = j;
        return prevState;
      }, () => {
        this.init({resData: this.state.resData})
      })
    }else{
      // 面版内模块拖入模块容器处理事件
      let resData = cloneDeep(this.currentPanelInfo);
      resData.boardX = i;
      resData.boardY = j;
      let biz = this.getBiz(i, j, resData.xn, resData.yn);
      if(biz === false)return;
      this.setState(prevState => {
        let index;
        if(this.resDataSpace.length > 0){
          index = this.resDataSpace.pop();
        }else{
          index = prevState.resData.length;
          prevState.resData.push({});
        }
        prevState.resData[index] = resData
        prevState.showMask = false;
        biz.forEach(item => {
          this.mapFlag[item[0]][item[1]] = index;
        })
        return prevState;
      }, () => {
        this.init({resData: this.state.resData})
      })
    }
  }

  render() {
    return (
      <div className="myBox">
        <div
          style={{
            width: '300px',
            height: '400px',
            position: 'absolute',
            left: `${this.state.boxWidth - 320}px`,
            top: '100px',
            zIndex: '150'
          }}
          ref="panelBox"
          className="panelBox">
          <CompPanel
            lineComps={3}
            data={this.state.panelData}
            panelMouseDown={(e) => this.panelMouseDown(e)}
            panelMouseUp={(e) => this.panelMouseUp(e)}
            panelDragStart={(e, item) => this.dragStartHandle(e, item)}
            saveConfig={() => this.saveConfig()}
            panelDragEnd={(e) => this.dragEndHandle(e)}
          />
        </div>
        <div ref='mainBox' className='customize animated bounceInRight'>
          {
            this.state.virColorMap.map((color, index) => {
              let i = parseInt(index / this.state.boxRange[0]);
              let j = index - i * this.state.boxRange[0];
              return (
                <div
                  onDrop={(e) => this.dropHandle(e, j + 1, i + 1)}
                  onDragOver={(e) => this.dragOverHandle(e, j + 1, i + 1)}
                  onDragEnter={(e) => this.dragEnterHandle(e, j + 1, i + 1)}
                  style={{
                    position: 'absolute',
                    top: `${i * this.state.oneHeight + 5}px`,
                    left: `${j * this.state.oneWidth + 5}px`,
                    width: `calc(${100 / this.state.boxRange[0]}% - 10px)`,
                    height: `calc(${100 / this.state.boxRange[1]}% - 12px)`,
                    background: color
                  }}
                ></div>

              )
            })
          }
          {/*
            Array(this.state.boxRange[1]).fill(0).map((ii, i) => {
              return (
                Array(this.state.boxRange[0]).fill(0).map((jj, j) => {
                  return (
                    <div
                      onDrop={(e) => this.dropHandleSpace(e, j + 1, i + 1)}
                      onDragOver={(e) => this.dragOverHandle(e, j + 1, i + 1)}
                      onDragEnter={(e) => this.dragEnterHandle(e, j + 1, i + 1)}
                      style={{
                        position: 'absolute',
                        top: `${i * this.state.oneHeight}px`,
                        left: `${j * this.state.oneWidth}px`,
                        width: `${100 / this.state.boxRange[0]}%`,
                        height: `${100 / this.state.boxRange[1]}%`,
                        //background: 'rgba(0, 0, 0, 0)'
                      }}
                    ></div>
                  )
                })
              )
            })
          */}
          {
            this.state.resData.map((item, index) => {
              if(!item.boardX)return '';
              return (
                <div
                  key={index}
                  className="itemBox"
                  style={{
                    top: `${(item.boardY - 1) * this.state.oneHeight}px`,
                    left: `${(item.boardX - 1) * this.state.oneWidth}px`,
                    width: item.htmlWidth,
                    height: item.htmlHeight,
                  }}
                  draggable="true"
                  onDragStart={(e) => this.dragStartHandle(e, index)}
                  onDragEnd={(e) => this.dragEndHandle(e)}
                  onDragOver={(e) => this.dragOverHandle(e, index)}
                  onDragEnter={(e) => this.dragEnterHandle(e, index)}
                  onDrop={(e) => this.dropHandle(e, index)}
                >
                  <div className="resizable">
                    <div className="resize-top"></div>
                    <div className="resize-right"></div>
                    <div className="resize-bottom"></div>
                    <div className="resize-left"></div>
                    <div className="resize-tl"></div>
                    <div className="resize-tr"></div>
                    <div className="resize-br"></div>
                    <div className="resize-bl"></div>
                  </div>
                  <div className="swapable">
                    <div className="swap-top"></div>
                    <div className="swap-right"></div>
                    <div className="swap-bottom"></div>
                    <div className="swap-left"></div>
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                  >
                    <div
                      className="itemBoxTitle">
                      {item.title}
                    </div>
                    <Icon
                      onClick={(e) => this.delItem(e, index)}
                      type="close-circle-o"
                      style={{position: 'absolute', right: '10px', top: '10px', fontSize: '22px', color: '#fff'}}/>
                    <div
                      className="mask"
                      style={{
                        display: this.state.showMask && this.currentDragIndex !== index? 'block': 'none',
                        background: this.state.colorMap[index] || 'rgba(0, 0, 0, 0.2)'
                      }}>
                    </div>
                    <iframe
                      className="itemBoxBody"
                      frameborder="0"
                      marginheight="0"
                      marginwidth="0"
                      style={{ background: 'blue' }}
                      src={item.url}>
                    </iframe>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    );
  }
}

export default Customize;
