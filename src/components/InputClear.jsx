import React, {Component,cloneElement} from "react";
import PropTypes from "prop-types"
import {Input, Icon} from 'antd';

export default class InputClear extends Input {
  constructor(props){
    super(props);
    this.state = {
      textareaStyles: null,
      isFocus: false,
      inputted:false,
    };
  }
  emitEmpty(){
    let domInput = this.refs.input;
    domInput.focus(); //聚焦input
    domInput.value = ''; //置空且不触发事件
    let event = new Event('input', { bubbles: true }); //源生方式触发onChange事件,方便兼容
    domInput.dispatchEvent(event);
  };
  _bindNotControlledInput(e){
    //console.log(e.currentTarget.value);
    this.setState({inputted:!!e.currentTarget.value})
  }
  componentDidMount() {
    this.resizeTextarea();
    if(!('value' in this.props)){
      this.refs.input.addEventListener('input',this._bindNotControlledInput.bind(this));
    }
  }
  componentWillUnmount(){
    if(!('value' in this.props)){
      this.refs.input.removeEventListener('input',this._bindNotControlledInput);
    }
  }
  renderLabeledIcon(children){
    const {props} = this;
    const {inputted} = this.state;

    if(props.type === 'textarea'){
      return children;
    }

    const clearIcon = props.disabled ? null : (
        (props.value || inputted) ? (
            <span className={`${props.prefixCls}-suffix`}><Icon type="cross-circle" onClick={this.emitEmpty.bind(this)}/></span>
          ) : null
      );
    if(!('prefix' in props || 'suffix' in props)){
      return (
        <span className={`${props.prefixCls}-preSuffix-wrapper`} style={props.style}>
          {cloneElement(children, {style: null})}
          {clearIcon}
        </span>
      );
    }

    const prefix = props.prefix ? (
        <span className={`${props.prefixCls}-prefix`}>
        {props.prefix}
      </span>
      ) : null;

    const suffix = props.suffix ? (
        <span className={`${props.prefixCls}-suffix`}>
        {props.suffix}
      </span>
      ) : null;

    return (
      <span className={`${props.prefixCls}-preSuffix-wrapper`} style={props.style}>
        {prefix}
        {cloneElement(children, {style: null})}
        {suffix}
        {clearIcon}
      </span>
    );
  }
}
