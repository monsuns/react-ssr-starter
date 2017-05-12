import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";

class Home extends Component {
  constructor(props){
    super(props);
  }

  componentDidMount(){}

  render(){
    return (
      <div className="page home">
        <h2>Welcome!</h2>
      </div>
    );
  }
}

Home.contextTypes = {
  router: React.PropTypes.object.isRequired
};
Home.propTypes = {};
function mapStateToProps(state){
  return state
}

export default connect(mapStateToProps)(Home)
