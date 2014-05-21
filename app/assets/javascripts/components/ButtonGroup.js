/** @jsx React.DOM */

var React = require('react');

var ButtonGroup = module.exports = React.createClass({
  render: function() {
    return (
      <div className="ButtonGroup">{this.props.children}</div>
    );
  }
});