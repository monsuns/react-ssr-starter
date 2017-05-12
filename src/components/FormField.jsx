/**
 * Created by Administrator on 2016/12/26.
 */
import "../assets/css/components/formField.scss";
import React, {Component} from "react";
import PropTypes from "prop-types";

export default class FormField extends Component {
  render() {
    const {title, afterContent, className} = this.props;
    let emptyHeader = !title && !afterContent;
    return (
      <div className={`component form-field ${className ? className : ''}`}>
        {emptyHeader ? null : (
          <div className="header">
            <p className="title">
              {title}
              <span className="after-content">{afterContent}</span>
            </p>
          </div>
        )}
        <div className="content">
          {this.props.children}
        </div>
      </div>
    )
  }
}

FormField.propTypes = {
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  afterContent: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ]),
  className: PropTypes.any,
};
