/** @jsx React.DOM */

var React = require('react');

var tinycolor = require('tinycolor2');

var GuideStore = require('../GuideStore');
var Dispatcher = require('../Dispatcher');

var Button = require('./Button');

var GuidesListItem = module.exports = React.createClass({
  handleClick: function() {
    Dispatcher.emit('navigate', '/'+this.props.guide.slug);
  },
  handleDelete: function(event) {
    event.preventDefault();
    event.stopPropagation();

    var guide = GuideStore.find(this.props.guide.slug);

    guide.destroy();
  },
  render: function() {
    var primary = tinycolor(this.props.guide.primary);

    var itemStyle = {
      backgroundColor: primary.toHexString()
    }

    var h2Style = {
      color: tinycolor.mostReadable(primary, ['black', 'white'])
    }

    return (
      <div onClick={this.handleClick} className="GuidesListItem" style={itemStyle}>
        <Button style={h2Style} className="plain delete" icon="delete" onClick={this.handleDelete} />
        <h2 style={h2Style}>{this.props.guide.title}</h2>
      </div>
    );
  }
});