/** @jsx React.DOM */

var React = require('react');

var Icon = require('./Icon');

var Spinner = module.exports = React.createClass({
  render: function() {
    return (
      <div className="Spinner" data-show={this.props.show}>
        <div>
          <div className="iconContainer"><Icon name="sync" /></div>
        </div>
      </div>
    );
  }
});