/** @jsx React.DOM */

// I wanted to call this "<Button/>", but the name clashes with an existing HTML tag

var Btn = React.createClass({
  onClick: function(event) {
    event.preventDefault();
    this.props.onClick();
  },
  render: function() {
    return this.transferPropsTo(
      <a className="Btn" href="#" onClick={this.onClick}>
        <i className="ss-icon">{this.props.icon}</i><span>{this.props.children}</span>
      </a>
    );
  }
});