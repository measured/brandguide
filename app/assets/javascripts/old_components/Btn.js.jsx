/** @jsx React.DOM */

var Btn = React.createClass({
  getDefaultProps: function() {
    return {
      onClick: function() {},
      disabled: false
    }
  },
  onClick: function(event) {
    event.preventDefault();
    this.props.onClick();
  },
  render: function() {
    var btnClass = React.addons.classSet({
      Btn: true,
      disabled: this.props.disabled
    });

    return this.transferPropsTo(
      <a className={btnClass} href="#" onClick={this.onClick}>
        <i className="Btn__icon" className="ss-icon">{this.props.icon}</i><span className="Btn__text">{this.props.children}</span>
      </a>
    );
  }
});