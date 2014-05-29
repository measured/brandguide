/** @jsx React.DOM */

var React = require('react');

var Icon = require('./Icon');

var Button = module.exports = React.createClass({
  handleClick: function(event) {
    event.preventDefault();
    if(typeof this.props.onClick === 'function') this.props.onClick(event);
  },
  render: function() {
    var children = [];

    if(this.props.icon) {
      children.push(<Icon key="icon" name={this.props.icon} />);
    }

    if(this.props.text) {
      children.push(<span key="text" className="text">{this.props.text}</span>);
    }

    return this.transferPropsTo(
      <a onClick={this.handleClick} className="Button" href="#" data-active={this.props.active}>
        {children}
      </a>
    );
  }
});