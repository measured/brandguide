/** @jsx React.DOM */

var React = require('react');
var Button = require('./Button');
var GuideModel = require('../GuideModel');
var GuidesListItem = require('./GuidesListItem');

var GuidesList = module.exports = React.createClass({
  createGuide: function() {
    var self = this;
    var title;

    if(title = prompt('Enter title')) {
      var attributes = {
        title: title
      }

      var guide = new GuideModel({ title: title });
      guide.sync();
    }
  },
  render: function() {
    var self = this;

    var guidesListItems = this.props.guides.map(function(guide) {
      return (
        <GuidesListItem key={guide.id} onClickGuide={self.props.onClickGuide} guide={guide} />
      );
    });

    return (
      <div className="GuidesList">
        <div className="grid">
          {guidesListItems}
        </div>
        <footer>
          <Button onClick={this.createGuide} className="green" text="Create New Guide" icon="compose" />
        </footer>
      </div>
    );
  }
});