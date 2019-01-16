import React, { Component } from 'react';
import CompOrigin from '@/components/lists/PanelOrigin';

export default class CompPanel extends Component{
  constructor(props){
    super(props);
  }

  render (){
    return <CompOrigin {...this.props} />
  }
}
