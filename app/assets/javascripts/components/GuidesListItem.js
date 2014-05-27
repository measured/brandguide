/** @jsx React.DOM */

var React = require('react');

var moment = require('moment');
var tinycolor = require('tinycolor2');

var GuideStore = require('../GuideStore');
var Dispatcher = require('../Dispatcher');

var Icon = require('./Icon');
var Button = require('./Button');

var GuidesListItem = module.exports = React.createClass({
  handleClick: function() {
    Dispatcher.emit('navigate', '/'+this.props.guide.slug);
  },
  handleDelete: function(event) {
    event.stopPropagation();

    var guide = GuideStore.find(this.props.guide.slug);

    guide.destroy();
  },
  handleUrlClick: function(event) {
    event.stopPropagation();
  },
  render: function() {
    var primary = tinycolor(this.props.guide.primary);

    var itemStyle = {
      backgroundColor: primary.toHexString()
    }

    var textStyle = {
      color: tinycolor.mostReadable(primary, ['black', 'white'])
    }

    var mtime = moment.unix(this.props.guide.mtime).fromNow();
    var guideUrl = window.location.host.replace('admin', this.props.guide.slug);

    return (
      <div onClick={this.handleClick} className="GuidesListItem" style={itemStyle}>
        <Button style={textStyle} className="plain delete" icon="delete" onClick={this.handleDelete} />
        <div style={textStyle} className="content">
          <h2>{this.props.guide.title}</h2>
          <span className="url"><a onClick={this.handleUrlClick} href={'http://'+guideUrl}>{guideUrl}</a></span>
        </div>
        <span style={textStyle} className="mtime"><Icon name="clock" />Updated {mtime}</span>
      </div>
    );
  }
});