/** @jsx React.DOM */

var React = require('react');
var Colour = require('./Colour');

var ColoursList = module.exports = React.createClass({
  render: function() {
    var self = this;

    var colours = (this.props.colours || []).map(function(colour) {
      return (
        <Colour public={self.props.public} key={colour.id} colour={colour} guide={self.props.guide} section={self.props.section} />
      );
    });

    return (
      <div className="ColoursList" data-show={this.props.show}>
        <div className="container">
          {colours}
        </div>
      </div>
    );
  }
});