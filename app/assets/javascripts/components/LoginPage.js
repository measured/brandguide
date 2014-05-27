/** @jsx React.DOM */

var React = require('react');

var $ = require('jquery');

var constants = require('../constants');

var Button = require('./Button');
var ButtonGroup = require('./ButtonGroup');

var LoginPage = module.exports = React.createClass({
  submitLogin: function(event) {
    if(event) event.preventDefault();

    var attributes = {
      email: this.refs.email.getDOMNode().value,
      password: this.refs.password.getDOMNode().value
    }

    $.post('/login.json', { user: attributes })
      .done(this.loginSucceeded);
  },
  loginSucceeded: function(response) {
    if(response.status === 'success') {
      var data = response.data;
      localStorage.setItem(constants.LOCALSTORAGE_AUTH_KEY, JSON.stringify(data));
      this.props.onLogin();
    } else {
      alert(response.status + ': ' + response.message);
    }
  },
  onKeyUp: function(event) {
    if(event.keyCode === 13) this.submitLogin();
  },
  render: function() {
    return (
      <div className="LoginPage" onKeyUp={this.onKeyUp}>
        <h1>Please sign in</h1>
        <input className="input email" ref="email" required type="email" placeholder="Email" />
        <input className="input password" ref="password" required type="password" placeholder="Password" />
        <ButtonGroup>
          <Button icon="user" text="Submit" onClick={this.submitLogin} />
        </ButtonGroup>
      </div>
    );
  }
});