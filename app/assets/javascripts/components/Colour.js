/** @jsx React.DOM */

var React = require('react');

var Button = require('./Button');
var Icon = require('./Icon');

var moment = require('moment');
var tinycolor = require('tinycolor2');

var GuideStore = require('../GuideStore');

var Colour = module.exports = React.createClass({
  changeTitle: function(event) {
    var guide = GuideStore.find(this.props.guide.slug);
    var colour = this.props.colour;
    colour.title = event.target.value;

    guide.updateSectionColour(this.props.section.slug, this.props.colour.id, colour);
  },
  changeHex: function(event) {
    var guide = GuideStore.find(this.props.guide.slug);
    var colour = this.props.colour;
    colour.hex = event.target.value;

    guide.updateSectionColour(this.props.section.slug, this.props.colour.id, colour);
  },
  handleDelete: function() {
    var guide = GuideStore.find(this.props.guide.slug);
    guide.deleteSectionColour(this.props.section.slug, this.props.colour.id);
  },
  handleInputKeyUp: function(event) {
    if([27,13].indexOf(event.keyCode) !== -1) event.target.blur();
  },
  render: function() {
    var hex = tinycolor(this.props.colour.hex);

    var swatchStyle = {
      backgroundColor: hex.toHexString()
    }

    var valueStyle = {
      color: tinycolor.mostReadable(hex, ['white', 'black'])
    }

    var mtime = moment.unix(this.props.colour.mtime).fromNow();

    return (
      <div className="Colour">
        <header>
          <div className="symbol"></div>
          <div className="title">
            <input placeholder="Colour name" value={this.props.colour.title} onKeyUp={this.handleInputKeyUp} onChange={this.changeTitle} readOnly={this.props.public} />
          </div>
          <div className="buttons" style={{ display: this.props.public ? 'none' : 'block' }}>
            <Button icon="delete" className="plain" onClick={this.handleDelete} />
          </div>
        </header>

        <div className="main">
          <div className="swatch" style={swatchStyle}>
            <input style={valueStyle} placeholder="Colour Value" value={this.props.colour.hex} onChange={this.changeHex} readOnly={this.props.public} />
          </div>
        </div>

        <footer>
          <div className="text">
            <span className="mtime"><Icon name="clock" /> Updated {mtime}</span>
          </div>
        </footer>
      </div>
    );
  }
});