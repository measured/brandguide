/** @jsx React.DOM */

var React = require('react');
var tinycolor = require('tinycolor2');

var Dispatcher = require('../Dispatcher');

var GuidesListItem = module.exports = React.createClass({
  handleClick: function() {
    Dispatcher.emit('navigate', '/'+this.props.guide.slug);
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
        <h2 style={h2Style}>{this.props.guide.title}</h2>
      </div>
    );
  }
});