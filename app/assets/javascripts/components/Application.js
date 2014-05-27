/** @jsx React.DOM */

var React = require('react');

var $ = require('jquery');

var Spinner = require('./Spinner');

var LoginPage = require('./LoginPage');
var AdminPage = require('./AdminPage');

var constants = require('../constants');

var Application = module.exports = React.createClass({
  getInitialState: function() {
    var state = {
      user: {},
      ajax: null
    }

    var savedState;

    if(savedState = localStorage.getItem(constants.LOCALSTORAGE_AUTH_KEY)) {
      state.user = JSON.parse(savedState).user;
    }

    return state;
  },
  setXhrHeaders: function() {
    var xhrHeaders = {};

    if(this.state.user.token && this.state.user.email) {
      var userToken = [this.state.user.email, this.state.user.token].join(':');
      xhrHeaders['X-User-Token'] = userToken;
    }

    $.ajaxSetup({
      headers: xhrHeaders
    });
  },
  logout: function() {
    localStorage.removeItem(constants.LOCALSTORAGE_AUTH_KEY);
    this.setState(this.getInitialState());
    window.location.href = '/';
  },
  login: function() {
    this.setState(this.getInitialState());
    this.setXhrHeaders();
    window.location.href = '/';
  },
  handleDragOver: function(event) {
    event.preventDefault();
  },
  handleDrop: function(event) {
    event.preventDefault();
  },
  componentWillMount: function() {
    this.setXhrHeaders();
  },
  componentDidMount: function() {
    var self = this;
  
    $(document).ajaxStart(function() {
      self.setState({ ajax: 'start' });
    });

    $(document).ajaxComplete(function() {
      self.setState({ ajax: 'complete' });
    });
  },
  componentDidUpdate: function() {
    this.setXhrHeaders();
  },
  render: function() {
    var viewComponent = this.state.user.token ?
      (<AdminPage onLogout={this.logout} user={this.state.user} />) :
      (<LoginPage onLogin={this.login} />);

    return (
      <div className="Application" data-ajax-state={this.state.ajax} onDragOver={this.handleDragOver} onDrop={this.handleDrop}>
        <Spinner show={this.state.ajax === 'start'} />
        {viewComponent}
      </div>
    );
  }
});