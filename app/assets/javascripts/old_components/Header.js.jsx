/** @jsx React.DOM */

var HeaderUser = React.createClass({
  render: function() {
    return (<div className="header__user">
      {this.props.user.email}
    </div>);
  }
});

var Header = React.createClass({
  render: function() {
    return (<div className="header">
      <h2 className="header__text">
        <a href=".">brandguide.io</a>
      </h2>

      <HeaderUser user={this.props.user} />
    </div>);
  }
});