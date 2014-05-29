/** @jsx React.DOM */

var React = require('react');

var Button = require('./Button');
var Icon = require('./Icon');

var moment = require('moment');
var tinycolor = require('tinycolor2');

var GuideStore = require('../GuideStore');

var Colour = module.exports = React.createClass({
  getInitialState: function() {
    return {
      currentColourInput: 'RGB',
      colourInputs: ['RGB', 'CMYK', 'Pantone']
    }
  },
  changeTitle: function(event) {
    var guide = GuideStore.find(this.props.guide.slug);
    var colour = this.props.colour;
    colour.title = event.target.value;

    guide.updateSectionColour(this.props.section.slug, this.props.colour.id, colour);
  },
  changeRgb: function(event) {
    var guide = GuideStore.find(this.props.guide.slug);
    var colour = this.props.colour;
    colour.rgb = event.target.value;

    guide.updateSectionColour(this.props.section.slug, this.props.colour.id, colour);
  },
  changeCmyk: function(event) {
    var guide = GuideStore.find(this.props.guide.slug);
    var colour = this.props.colour;
    colour.cmyk = event.target.value;

    guide.updateSectionColour(this.props.section.slug, this.props.colour.id, colour);
  },
  changePantone: function(event) {
    var guide = GuideStore.find(this.props.guide.slug);
    var colour = this.props.colour;
    colour.pantone = event.target.value;

    guide.updateSectionColour(this.props.section.slug, this.props.colour.id, colour);
  },
  handleDelete: function() {
    if(confirm('Are you sure?')) {
      var guide = GuideStore.find(this.props.guide.slug);
      guide.deleteSectionColour(this.props.section.slug, this.props.colour.id);
    }
  },
  handleInputKeyUp: function(event) {
    if([27,13].indexOf(event.keyCode) !== -1) event.target.blur();
  },
  toggleColourInput: function() {
    var colourInput = (this.state.colourInputs[this.state.colourInputs.indexOf(this.state.currentColourInput)+1] || this.state.colourInputs[0]);

    this.setState({ currentColourInput: colourInput });
  },
  render: function() {
    var rgb = tinycolor(this.props.colour.rgb);

    var swatchStyle = {
      backgroundColor: rgb.toHexString()
    }

    var valueStyle = {
      color: tinycolor.mostReadable(rgb, ['white', 'black'])
    }

    var mtime = moment.unix(this.props.colour.mtime).fromNow();

    var colourInput;

    if(this.state.currentColourInput === 'RGB') {
      colourInput = (
        <input style={valueStyle} placeholder="#000000" value={this.props.colour.rgb} onChange={this.changeRgb} readOnly={this.props.public} />
      );
    }

    if(this.state.currentColourInput === 'CMYK') {
      colourInput = (
        <input style={valueStyle} placeholder="C,M,Y,K" value={this.props.colour.cmyk} onChange={this.changeCmyk} readOnly={this.props.public} />
      );
    }

    if(this.state.currentColourInput === 'Pantone') {
      colourInput = (
        <input style={valueStyle} placeholder="Colour Name" value={this.props.colour.pantone} onChange={this.changePantone} readOnly={this.props.public} />
      );
    }

    return (
      <div className="Colour" data-public={!!this.props.public}>
        <header>
          <div className="symbol"></div>
          <div className="title">
            <input placeholder="Colour name" value={this.props.colour.title} onKeyUp={this.handleInputKeyUp} onChange={this.changeTitle} readOnly={this.props.public} />
          </div>
          <div className="buttons" style={{ display: this.props.public ? 'none' : 'flex' }}>
            <Button icon="delete" className="plain" onClick={this.handleDelete} />
          </div>
        </header>

        <div className="main">
          <div className="swatch" style={swatchStyle}>
            <Button onClick={this.toggleColourInput} className="toggleColourInput" style={valueStyle} text={this.state.currentColourInput} />
            {colourInput}
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