/** @jsx React.DOM */

var React = require('react');
var Colour = require('./Colour');

var ColoursList = module.exports = React.createClass({
  render: function() {
    var self = this;

    var colours = (this.props.colours || []).map(function(colour) {
      return (
        <Colour key={colour.id} colour={colour} guide={self.props.guide} section={self.props.section} />
      );
    });

    return (
      <div className="ColoursList">
        <div className="container">
          {colours}
        </div>
      </div>
    );
  }
});