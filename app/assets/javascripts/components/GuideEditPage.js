/** @jsx React.DOM */

var React = require('react');

var GuideStore = require('../GuideStore');
var Drawer = require('./Drawer');
var SectionEditor = require('./SectionEditor');

var GuideEditPage = module.exports = React.createClass({
  getInitialState: function() {
    return {
      section: null,
      drawerOpen: true,
      guide: GuideStore.find(this.props.guideId).attributes
    }
  },
  componentWillMount: function() {
    GuideStore.on('change', this.guideStoreChanged);
  },
  componentWillUnmount: function() {
    GuideStore.off('change', this.guideStoreChanged);
  },
  componentDidUpdate: function(prevProps, prevState) {
    if(prevProps.sectionId !== this.props.sectionId) {
      this.selectSection();
    }
  },
  guideStoreChanged: function() {
    this.setState({ guide: GuideStore.find(this.props.guideId).attributes });
    this.selectSection();
  },
  selectSection: function() {
    var guide = GuideStore.find(this.props.guideId);

    var section = this.props.sectionId ? guide.findSection(this.props.sectionId) : null;
    this.setState({ section: section });
  },
  toggleDrawer: function() {
    this.setState({ drawerOpen: !this.state.drawerOpen });
  },
  render: function() {
    var guide = this.state.guide || {};

    return (
      <div className="GuideEditPage">
        <Drawer guide={guide} section={this.state.section} open={this.state.drawerOpen} onToggle={this.toggleDrawer} />
        <SectionEditor guide={guide} section={this.state.section} />
      </div>
    );
  }
});