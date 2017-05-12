import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import QueueAnim from 'rc-queue-anim';
import Tools from '../utils/tools';

class Application extends Component {
  constructor(props){
    super(props);
  }

  getChildContext(){
    return {
      dispatch: this.props.dispatch,
    };
  }

  componentDidMount(){}

  render(){
    return (
      <div className="root">
        {this.props.children}
      </div>
    )
  }
}

Application.contextTypes = {
  router: PropTypes.object,
};
Application.propTypes = {
  children: PropTypes.node,
};
Application.childContextTypes = {
  dispatch: PropTypes.func,
};
function mapStateToProps(state){
  return state
}

export default connect(mapStateToProps)(Application)
