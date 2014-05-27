/** @jsx React.DOM */

var React = require('react');

var Button = require('./Button');

var Dispatcher = require('../Dispatcher');

var DrawerSectionsList = require('./DrawerSectionsList');

var Drawer = module.exports = React.createClass({
  handleToggle: function(event) {
    event.preventDefault();
    this.props.onToggle();
  },
  handleBack: function() {
    Dispatcher.emit('navigate', '/');
  },
  render: function() {
    return (
      <div className="Drawer" data-open={this.props.open}>
        <div className="contents" onClick={this.props.onOpenDrawer}>
          <header>
            <Button onClick={this.handleBack} className="back plain" icon="back" />
            <h2>{this.props.guide.title}</h2>
            <Button className="settings plain" icon="gear" />
          </header>
          <div className="content">
            <DrawerSectionsList guide={this.props.guide} section={this.props.section} />
          </div>
        </div>
        <div className="toggle">
          <a href="#" onClick={this.handleToggle}><i /><i /><i /></a>
        </div>
      </div>
    );
  }
});