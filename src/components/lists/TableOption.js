import TableBase from "@/components/lists/TableBase";
import {connect} from 'react-redux';
import {option_sort, controller} from '@/actions';
import CalcWidthAndHeight from '@/components/highOrder/CalcWidthAndHeight';
import _round from "lodash/round";
import _cloneDeep from 'lodash/cloneDeep';
import _orderBy from 'lodash/orderBy';

class CommonTable extends TableBase{
  constructor(props){
    super(props);
  }

  componentDidMount() {
    this.batchBindEvent();
    this.emitSocketRequest('sub');
    if(this.props.data && this.props.data[this.props.actionName]){
      this.props.tableProps && this.props.tableProps.isHeader && this.switchSelect(0, 'auto');
    }
  }

  componentWillUnmount() {
    this.batchUnBindEvent();
    this.emitSocketRequest('unmount');
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.actionName !== this.props.actionName){
      // 当actionName变了时初始化表格
      this.init(nextProps, this.sortType);
      return;
    }
    if(nextProps.data && nextProps.data[nextProps.actionName]){
      let monitorData = window.superMonitor[nextProps.actionName];
      let nextdata = nextProps.data[nextProps.actionName];
      let nowdata = monitorData && monitorData.preData; // this.props.data[nextProps.actionName];
      if(this.virtualData.length === 0){
        // 如果虚拟数据为空数组, 则说明第一次来数据了
        this.virtualData = this.getVirtualData(nextdata);
        let tableHeight = nextdata.count * this.state.colHeight;
        this.setState({
          verticalHeight: Math.max(_round((nextProps.height - this.tabsHeight - this.state.colHeight) / tableHeight * nextProps.height, 2), this.minVerticalHeight),
          showData: _cloneDeep(nextdata.data.slice(0, this.state.showNum + this.otherShowNum)),
          tableHeight
        }, () => {
          nextProps.tableProps && nextProps.tableProps.isHeader && this.switchSelect(0, 'auto');
        });
      }
      if(nowdata && nowdata.duuid !== nextdata.duuid){
        if(nowdata.count !== nextdata.count){
          this.init(nextProps, this.sortType);
        }else{
          //this.virtualData.splice(nextdata.startNum, this.state.showNum, ...nextdata.data);
          this.virtualData.splice(nextdata.startNum, nextdata.data.length, ...nextdata.data);
          let [sortKey, sortType] = this.sortType.split('_');
          this.virtualData = _orderBy(this.virtualData, sortKey, sortType);
          nextdata.startNum === this.startNum && this.setState({showData: _cloneDeep(this.virtualData.slice(0, this.state.showNum + this.otherShowNum))}, () => {
            this.isSpaceEmit && this.execFun(this.activeRow);
          });
        }
      }
    }
  }
}

export default connect(
  state => ({
    data: state.Data,
    isShowKeyBoard: state.DisplayController.isShowKeyBoard,
    isShowChartModelRight: state.DisplayController.isShowChartModelRight
  }), {option_sort, controller}
)(CalcWidthAndHeight(CommonTable));
