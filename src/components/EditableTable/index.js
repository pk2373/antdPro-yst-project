import React from 'react';
import {Table, Input, Icon, Popconfirm} from 'antd';

export default class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.columns = this.props.columns;
    this.state = {data: this.props.data};
    this.cacheData = this.props.data.map(item => ({...item}));
  }

  cancel(key) {
    const newData = [...this.state.data];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      Object.assign(target, this.cacheData.filter(item => key === item.key)[0]);
      delete target.editable;
      this.setState({data: newData});
    }
  }

  render() {
    return <Table bordered dataSource={this.props.data} columns={this.columns}/>;
  }
}
