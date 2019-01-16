import React, { Component } from 'react';
import { connect } from 'react-redux';
import { controller } from "@/actions";

export default function (F10WrappedComponent) {
  class NewComponent extends Component {
    constructor(props) {
      super(props);
      this.state = {
        historyStore: [this.init()],
        f10Data: {
          uuid: '',
          exchange: '',
          stockCode: '',
        }
      }
    }

    init() {
      let uuid;
      if (Object.keys(this.props.f10Data).length > 0) {
        uuid = this.props.f10Data.uuid;
      } else {
        uuid = this.props.match.params.uuid;
      }
      return uuid
    }

    componentDidMount() {
     
      let [exchange, stockCode] = this.init().split('.');
      this.setState(prev => {
        prev.f10Data = {
          uuid: this.init(),
          exchange: exchange,
          stockCode: stockCode,
        }
        return prev
      },()=>{
        this.props.controller({f10Data: this.state.f10Data})
      })
    }

    componentWillReceiveProps(nextProps) {
      // debugger
      if (nextProps.f10Data.uuid !== this.props.f10Data.uuid) {
        if (this.state.historyStore.findIndex(item => item === nextProps.f10Data.uuid) === -1) {
          let [exchange, stockCode] =nextProps.f10Data.uuid.split('.');
          this.setState(prev => {
            prev.f10Data = {
              uuid: nextProps.f10Data.uuid,
              exchange: exchange,
              stockCode: stockCode,
            }
            prev.historyStore.push(nextProps.f10Data.uuid);
            return prev
          })
        } else {
          this.setState({});
        }
      }
    }

    render() {
      return this.state.historyStore.map(item => item === this.state.f10Data.uuid ? <F10WrappedComponent {...this.props} f10Data={this.state.f10Data} /> : '');
    }

  }
  NewComponent = connect(
    state => ({ f10Data: state.DisplayController.f10Data }), { controller }
  )(NewComponent);
  return NewComponent
}


