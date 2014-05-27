/** @jsx React.DOM */

var React = require('react');
var ReactRouter = require('react-router-component');

var $ = require('jquery');

var GuideStore = require('../GuideStore');
var Dispatcher = require('../Dispatcher');

var Location = ReactRouter.Location;
var Locations = ReactRouter.Locations;

var Header = require('./Header');

var GuidesListPage = require('./GuidesListPage');
var GuideEditPage = require('./GuideEditPage');

var AdminPage = module.exports = React.createClass({
  componentDidMount: function() {
    Dispatcher.on('navigate', this.refs.router.navigate);

    GuideStore.fetch();
  },
  componentWillUnmount: function() {
    Dispatcher.rmoveListener('navigate');
  },
  onBeforeNavigation: function() {
    $(this.getDOMNode()).hide();
  },
  onNavigation: function() {
    // This is a hideous hackfix for a troublesome layout bug
    var self = this;
    
    setTimeout(function() {
      $(self.getDOMNode()).show();
    }, 1);
  },
  render: function() {
    return (
      <div className="AdminPage">
        <Header user={this.props.user} onLogout={this.props.onLogout} />
        <Locations ref="router" className="Location" onBeforeNavigation={this.onBeforeNavigation} onNavigation={this.onNavigation}>
          <Location path="/" handler={GuidesListPage} />
          <Location path="/:guideId" handler={GuideEditPage} />
          <Location path="/:guideId/:sectionId" handler={GuideEditPage} />
        </Locations>
      </div>
    );
  }
});