/** @jsx React.DOM */

var React = require('react/addons');

var Colour = require('./Colour');

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var ColoursList = module.exports = React.createClass({
  render: function() {
    var self = this;

    var colours = (this.props.colours || []).map(function(colour) {
      return (
        <Colour public={self.props.public} key={colour.id || colour.key} colour={colour} guide={self.props.guide} section={self.props.section} />
      );
    });

    return (
      <div className="ColoursList" data-show={this.props.show}>
        <ReactCSSTransitionGroup className="container" component={React.DOM.div} transitionName="pop">
          {colours}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
});