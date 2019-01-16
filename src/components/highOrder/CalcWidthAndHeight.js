import React, { Component } from "react";

export default function CalcWidthAndHeight(WrappedComponent) {
  class ResponsiveComponent extends Component {
    constructor(props) {
      super(props);
      this.handleWindowResize = this.handleWindowResize.bind(this);
      this.state = {
        isShow: false,
        renderBz: false
      };
      this.renderList = [[true, false], [false, true]];
    }

    componentDidMount() {
      window.addEventListener("resize", this.handleWindowResize);
      this.handleWindowResize();
    }

    componentWillUnmount() {
      window.removeEventListener("resize", this.handleWindowResize);
    }

    componentWillReceiveProps(nextProps) {
      if(this.props.isShowChartModelRight !== nextProps.isShowChartModelRight){
        this.handleWindowResize();
      }
    }

    handleWindowResize() {
      const { width, paddingLeft, paddingRight, height, paddingTop, paddingBottom } = window.getComputedStyle(this.node);
      const w = parseFloat(width) - (parseFloat(paddingLeft) + parseFloat(paddingRight));
      const h = parseFloat(height) - (parseFloat(paddingTop) + parseFloat(paddingBottom));
      console.log('给定宽: ', w, ', 给定高: ', h);
      if(h === 0 || (this.state.width === Math.round(w) && this.state.height === Math.round(h)))return ;
      this.setState(prev => ({
        ...prev,
        renderBz: !prev.renderBz,
        width: Math.round(w),
        height: Math.round(h),
        isShow: true
      }));
    }

    render() {
      return (
        <div style={{width: '100%', height: '100%'}} ref={node => this.node = node}>
          {
            this.state.isShow && this.renderList[Number(this.state.renderBz)].map(bz => bz && <WrappedComponent {...this.state} {...this.props} />)
          }
        </div>
      )
    }
  }

  return ResponsiveComponent;
}

