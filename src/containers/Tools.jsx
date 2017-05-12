import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";

class Tools extends Component {
  constructor(props){
    super(props);
    this.state = {
    }
  }

  componentDidMount(){
    console.log('[PAGE] tools');
  }

  render(){
    return (
      <div className="page tools">
        <h2>Welcome!</h2>
        <h3>欢迎登录!</h3>
      </div>
    );
  }
}

Tools.contextTypes = {
  router: React.PropTypes.object.isRequired
};
Tools.propTypes = {};
function mapStateToProps(state){
  return state
}

export default connect(mapStateToProps)(Tools)
