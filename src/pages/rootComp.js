import React, { Component } from 'react';
import {connect} from "react-redux";
import QuoteDetails from '@/pages/Quotes/QuoteDetails';
import KeyBoardOrigin from '@/components/lists/KeyBoardOrigin';
import NewsDetails from '@/pages/Quotes/NewsDetails';
import F10NewsListMore from '@/pages/Quotes/StockF10/F10NewsListMore';
import AddOptionPanelOrigin from '@/components/lists/AddOptionPanelOrigin';
import PensDetail from '@/components/lists/PensDetail';
import { monitor, controller} from '@/actions';


class RootComp extends Component{
  render(){
    return (
      <div>
        {this.props.displayController.isShowQuoteDetails? <QuoteDetails />: null}
        {this.props.displayController.isShowNewsDetails?<NewsDetails />:null}
        {this.props.displayController.isShowF10NewsListMore?<F10NewsListMore />:null}
        {this.props.displayController.isShowPensDetail?<PensDetail />:null}
        <AddOptionPanelOrigin />
        <KeyBoardOrigin/>
      </div>
    )
  }
}
export default connect(
  state => ({displayController: state.DisplayController}), { monitor, controller}
)(RootComp);
