import React, {Component} from "react";
//import PropTypes from "prop-types";
import {connect} from "react-redux";

class NotFound extends Component {
  constructor(props){
    super(props);
  }

  componentDidMount(){
  }

  render(){
    return (
      <div className="page not-found">
        <p>PAGE NOT FOUND!</p>
      </div>
    );
  }
}

NotFound.propTypes = {};
function mapStateToProps(state){
  return state
}

export default connect(mapStateToProps)(NotFound)
