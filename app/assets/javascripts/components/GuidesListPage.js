/** @jsx React.DOM */

var React = require('react');
var GuideStore = require('../GuideStore');
var GuidesList = require('./GuidesList');

var GuidesListPage = module.exports = React.createClass({
  getInitialState: function() {
    return {
      guides: GuideStore.attributes()
    }
  },
  componentDidMount: function() {
    GuideStore.on('change', this.guideStoreChanged);
  },
  componentWillUnmount: function() {
    GuideStore.off('change', this.guideStoreChanged);
  },
  guideStoreChanged: function() {
    this.setState({ guides: GuideStore.attributes() });
  },
  render: function() {
    return (
      <div className="GuidesListPage">
        <GuidesList
          onClickGuide={this.props.onClickGuide}
          onCreateGuide={this.props.onCreateGuide}
          guides={this.state.guides} />
      </div>
    );
  }
});