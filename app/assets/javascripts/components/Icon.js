/** @jsx React.DOM */

var React = require('react');

var Icon = module.exports = React.createClass({
  render: function() {
    return this.transferPropsTo(
      <i className="Icon ss-icon">{this.props.name}</i>
    );
  }
});