import React, { Component } from 'react';
import PropTypes from "prop-types";
import { toolConfig } from '@/components/lists/klineConfig';
import { TrendLine } from "@/components/react-stockcharts/lib/interactive";
import { connect } from 'react-redux';
import { update } from '@/actions/';

const drawLineMap = {TrendLine, };

class DrawLine extends Component{
  constructor(props){
    super(props);
    this.state = {
      trends: {}
    }
    this.onDrawCompleteChart = this.onDrawCompleteChart.bind(this);
    this.onCompleteHandle = this.onCompleteHandle.bind(this);
  }

  componentDidMount() {
  }

  onDrawCompleteChart(){

  }

  onCompleteHandle(trends, compType){
    this.setState(prev => (prev.trends[compType] = trends, prev), _ => {
      this.props.update({type: 'drawLineData', updateArr: [{enabledName: '', icon: ''}]})
    });
  }

  render(){
    const { chartName, drawLineData={} } = this.props;
    const { enabledName } = drawLineData;
    const { trends } = this.state;
    let self = this;
    return (
      <g>
        {
          toolConfig.map(bigGenre => {
            return bigGenre.icons.map(genre => {
              if(!genre.compType || !drawLineMap[genre.compType]){
                return null;
              }
              const Comp = drawLineMap[genre.compType];
              let props = {
                ref: node => self[`node_${chartName}`] = node,
                enabled: enabledName === genre.compType,
                trends: trends[genre.compType] || [],
                onComplete: trends => self.onCompleteHandle(trends, genre.compType),
                currentPositionStroke: '#DECF3A',
                appearance: {
                  stroke: '#DECF3A',
                  fontFill: '#DECF3A',
                  edgeStroke: '#DECF3A',
                  nsEdgeFill: '#DECF3A',
                }
              };
              switch(genre.compType){
                case 'TrendLine':
                  props.type = genre.drawType;
                  break;
                case '':
                  break;
              }
              return (
                <Comp key={chartName} {...props} />
              )
            })
          })
        }
      </g>
    )
  }
}

DrawLine.propTypes = {
  chartName: PropTypes.string, // KX, FS, IND
}

DrawLine.defaultProps = {
}

DrawLine = connect(
  state => ({
    drawLineData: state.DisplayController.drawLineData
  }), { update }
)(DrawLine);

export { DrawLine };
