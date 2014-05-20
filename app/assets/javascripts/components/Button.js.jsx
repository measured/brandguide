/** @jsx React.DOM */

var ButtonGroup = React.createClass({
  render: function() {
    return (
      <div className="ButtonGroup">{this.props.children}</div>
    );
  }
});

var Icon = React.createClass({
  render: function() {
    return this.transferPropsTo(
      <i className="Icon ss-icon">{this.props.name}</i>
    );
  }
});

var Button = React.createClass({
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
      <a onClick={this.handleClick} className="Button" href="#">
        {children}
      </a>
    );
  }
});