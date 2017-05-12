/**
 * 带条件查找、带分页的Table
 * 本组件仅保存自己的分页状态(loading、当前第几页，分页大小等)，数据通过pros传入。
 * @param tableProps object:{columns:[],dataSource:[]} 必须
 * @param action func 必须:拉数据方法
 * @param condition object 必须:查数据的条件
 */
import React, {Component} from "react";
import PropTypes from "prop-types";
import {Table, Modal} from 'antd';
import isEqual from "lodash/isEqual";

export default class DataTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      pagination: {
        total: 0,
        current: 1,
        pageSize: props.pageSize,
        showSizeChanger: true,
        pageSizeOptions: ["10", '20', '30', '40', '50', '100'],
        showQuickJumper: true,
        showTotal(total){
          return `共 ${total} 条数据`;
        }
      }
    };
    this.static = {
      mounted:false,
    };
    this.fetchData = this._fetchData.bind(this);
    this.refreshData = this._refreshData.bind(this);
  }
  componentDidMount(){
    this.static.mounted = true;
    this.fetchData();
  }

  componentWillReceiveProps(nextProps) {
    //新props,新查询条件,页码重置为1后直接拉接口查询
    //console.log('[data table props]',nextProps.condition,this.props.condition);
    if(!this.static.mounted) return; //检查组件是否挂载
    let flag = (this.props.queryTimeField in this.props.condition); //query_time 在查询条件中,则属于自动刷新方式,设置state后刷新数据
    if(!isEqual(this.props.condition,nextProps.condition)){
      this.setState({
        pagination: Object.assign({},this.state.pagination, {total: nextProps.totalNum,current: 1,}),
      },()=>{
        if(flag) this.fetchData();
      });
    }
  }
  componentWillUnmount(){
    this.static.mounted = false;
  }

  //父组件调用手动刷新数据使用
  _refreshData(pageNo=1){
    if(!this.static.mounted) return;
    let pagination = {current:pageNo};
    this.setState({
      pagination:Object.assign({},this.state.pagination,pagination)
    }, () => {
      this.fetchData();
    });
  }

  //操作表格页码
  handleTableChange(pagination, filters, sorter) {
    const currentPagination = this.state.pagination;
    currentPagination.current = pagination.current;
    currentPagination.pageSize = pagination.pageSize;
    this.setState({
      pagination: currentPagination,
    }, () => {
      this.fetchData();
    });
  }

  _fetchData() {
    const {dispatch} = this.context;
    const {action, condition,totalField,queryTimeField,errHandler,pageNoField,pageSizeField} = this.props;
    const {pagination} = this.state;
    const pageParams = {};
    pageParams[pageSizeField] = pagination.pageSize.toString();
    pageParams[pageNoField] = pagination.current.toString();
    const param = Object.assign({}, pageParams, condition);
    delete param[queryTimeField];
    //console.log("[DATA TABLE] 表格查询参数: ", param);
    this.setState({loading: true});
    dispatch(action(param, (json) => {
      //console.log("[DATA TABLE] 新数据返回: ",json);
      if (json.status.toString() === '0' || (json.status.toString()==='8193' && json.message==='查询无记录')) {
        let totalNum = Number(json[totalField]);
        this.setState({
          loading: false,
          pagination:Object.assign({},this.state.pagination,{total:totalNum}),
        });
      }else{
        this.setState({
          loading: false,
        });
        if(errHandler){
          errHandler(json)
        }else{
          this.reqErr(json);
        }
      }
    }));
  }

  //出错提示
  reqErr(json) {
    Modal.error({
      title: '请求出错',
      content: (
        <p>代码: {json.status} <br/>消息: {json.message}</p>
      ),
      onOk(){},
      onCancel(){}
    });
    //notification.error({
    //  message: title?title:'请求出错',
    //  description:`[${json.status}] ${json.message}`
    //})
  }

  render() {
    const {tableProps} = this.props;
    const {pagination, loading} = this.state;
    return (
      <Table
        className="component data-table"
        loading={loading}
        pagination={pagination}
        onChange={this.handleTableChange.bind(this)}
        {...tableProps}
      />
    )
  }
}
DataTable.defaultProps = {
  condition     : {},
  pageSize      : 10,
  queryTimeField: 'query_time',
  totalField    : 'total_num',
  pageNoField   : 'page_no',
  pageSizeField : 'page_size',
};
DataTable.contextTypes = {
  dispatch: PropTypes.func.isRequired
};
DataTable.PropTypes = {
  condition     : PropTypes.object, //查询条件
  tableProps    : PropTypes.object,
  action        : PropTypes.func,
  totalField    : PropTypes.string, //totalNum(总数量)在接口返回json中的字段名 //兼容不同的接口
  pageNoField   : PropTypes.string, //page_no(页码)在请求参数中的字段名 //兼容不同的接口
  pageSizeField : PropTypes.string, //page_size(每页数量)在请求参数中的字段名 //兼容不同的接口
  pageSize      : PropTypes.number, //初始化每页请求的数量
  queryTimeField: PropTypes.string, //手动刷新的字段名
  errHandler    : PropTypes.func,   //接口错误处理函数,方便为不同错误做区别处理
};
