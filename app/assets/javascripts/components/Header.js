/** @jsx React.DOM */

var React = require('react');
var Button = require('./Button');

var Header = module.exports = React.createClass({
  render: function() {
    var avatarStyle = {
      backgroundImage: 'url('+this.props.user.gravatar+')'
    }

    if(!this.props.user.gravatar) avatarStyle = {}

    return (
      <div className="Header">
        <div className="content">
          <h1><a href="/">brandguide.io</a></h1>

          <div className="user">
            <Button onClick={this.props.onLogout} icon="logout" className="plain" text="Sign out" />
            
            <span className="separator">&bull;</span>
            
            <a className="profile" href="#">
              <span>{this.props.user.email}</span>
              <i className="avatar" style={avatarStyle} />
            </a>
          </div>
        </div>
      </div>
    );
  }
});