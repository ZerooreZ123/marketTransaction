import React from 'react';
import { Modal, Form } from 'antd';
import PropTypes from "prop-types";
const FormItem = Form.Item;

class HighModal extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      visible: false,
      config: {}
    }
    props.setRef && props.setRef(this);
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  switchSettingState(e, index) {
    this.setState(prev => ({...prev, visible: !prev.visible}));
  }

  render(){
    const { visible, config } = this.state;
    if(Object.keys(config).length === 0)return null;
    const { title, getChildren, children, self } = this.props;
    let showTitle;
    if(title.constructor === Function){
      showTitle = title(config);
    }else{
      showTitle = title;
    }
    return (
      <Modal
        title={showTitle}
        visible={visible}
        onCancel={e => this.switchSettingState(e)}
        footer={null}
      >
        {getChildren && getChildren.call(this, config, self) || children}
      </Modal>
    )
  }
}

HighModal.propTypes = {
  title: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string
  ]),
  getChildren: PropTypes.func
}

HighModal.defaultProps = {
  title: '设置'
}

export default Form.create()(HighModal);
