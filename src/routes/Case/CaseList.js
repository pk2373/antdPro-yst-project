import React, {Fragment, PureComponent} from 'react';
import {connect} from 'dva';
import {
  Button,
  Card,
  Col,
  Dropdown,
  Form,
  Icon,
  Input,
  Menu,
  Row,
} from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {getUrlPar, urlParAssign} from '../../utils/utils';

import styles from './caseList.less';

const FormItem = Form.Item;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const columns = [
  {
    title: '车牌号码',
    dataIndex: 'carPlate',
  },
  {
    title: '工单号',
    dataIndex: 'num',
    render: (num, record) => (
      <a href={`#/id=${record.id}/casesDetail`}>{num}</a>
    )
  },
  {
    title: '工单详情',
    dataIndex: 'orderDetail',
  },
  {
    title: '接待员',
    dataIndex: 'receptionistName',
  },
  {
    title: '备注信息',
    dataIndex: 'note',
  },
  {
    title: '创建时间',
    dataIndex: 'createDate',
  },
  {
    title: '更新时间',
    dataIndex: 'operateDate',
  },
  {
    title: '操作',
    dataIndex: 'id',
    render: id => (
      <Fragment>
        <a href={`#/id=${id}/profile/basic`} >删除</a>
      </Fragment>
    ),
  },
];

const pageSize = 10;

@connect(({ cases, loading }) => ({
  cases,
  loading: loading.models.cases,
}))
@Form.create()

export default class CaseList extends PureComponent {
  state = {
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'cases/fetch',
      page: getUrlPar().current,
      pageSize: pageSize,
      params: {
        ...getUrlPar(),
      },
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const {dispatch} = this.props;
    const {formValues} = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = {...obj};
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    urlParAssign({
      current: pagination.current,
      ...params,
      page: 'case',
    });

    dispatch({
      type: 'cases/fetch',
      page: pagination.current,
      pageSize: pageSize,
      params: params,
    });
  }

  handleFormReset = () => {
    const {form, dispatch} = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });

    urlParAssign({
      current: 1,
    });

    dispatch({
      type: 'cases/fetch',
      page: 1,
      pageSize: pageSize,
      params: {},
    });
  }

  handleMenuClick = (e) => {
    const {dispatch} = this.props;
    const {selectedRows} = this.state;

    if (!selectedRows) return;

    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'cases/remove',
          payload: {
            no: selectedRows.map(row => row.no).join(','),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  }

  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  }

  handleSearch = (e) => {
    e.preventDefault();

    const {dispatch, form} = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
      };

      this.setState({
        formValues: values,
      });

      urlParAssign({
        current: 1,
        ...values,
      });

      dispatch({
        type: 'cases/fetch',
        page: 1,
        pageSize: pageSize,
        params: values,
      });
    });
  }

  renderForm() {
    const {getFieldDecorator} = this.props.form;
    const urlPar = getUrlPar();
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={8} sm={24}>
            <FormItem label="车牌号码">
              {getFieldDecorator('carPlate', {initialValue: urlPar.code || ''})(
                <Input placeholder="请输入"/>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="单号">
              {getFieldDecorator('num', {initialValue: urlPar.num || ''})(
                <Input placeholder="请输入"/>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>重置</Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {cases: {data, total }, loading} = this.props;
    const {selectedRows} = this.state;
    const { current } = getUrlPar();
    const paginationProps = {
      total: total,
      current: current,
      pageSize: pageSize,
    }

    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    return (
      <PageHeaderLayout title="查询表格">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
            <div className={styles.tableListOperator}>
              {
                selectedRows.length > 0 && (
                  <span>
                    <Button>批量操作</Button>
                    <Dropdown overlay={menu}>
                      <Button>
                        更多操作 <Icon type="down"/>
                      </Button>
                    </Dropdown>
                  </span>
                )
              }
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              pagination={paginationProps}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
