/** @jsx React.DOM */

var React = require('react');

var Icon = require('./Icon');
var GuideStore = require('../GuideStore');
var Dispatcher = require('../Dispatcher');

var DrawerSectionsListItem = module.exports = React.createClass({
  getInitialState: function() {
    return {
      input: {
        icon: 'plus',
        placeholder: 'Add Section'
      }
    }
  },
  handleKeyUp: function() {
    var input = this.refs.input.getDOMNode();

    if(event.keyCode === 13) {
      GuideStore.find(this.props.guide.slug).addSection(input.value, this.props.section.slug);
    }

    if([13, 27].indexOf(event.keyCode) !== -1) {
      input.value = null;
      input.blur();
    }
  },
  handleInputFocus: function() {
    this.setState({
      input: {
        icon: 'openbook',
        placeholder: 'Enter title'
      }
    });
  },
  handleInputBlur: function() {
    this.setState({ input: this.getInitialState().input });
    this.refs.input.getDOMNode().value = null;
  },
  handleClick: function(href, event) {
    if(event) event.preventDefault();
    Dispatcher.emit('navigate', href, { replace: true });
  },
  render: function() {
    var self = this;
    var guide = GuideStore.find(this.props.guide.slug);

    var children = guide.childrenOfSection(this.props.section.id).map(function(child) {
      var href = '/'+self.props.guide.slug+'/'+child.slug;

      return (
        <li key={child.id}>
          <a onClick={self.handleClick.bind(self, href)} href={href}>
            <span>{child.title}</span>
          </a>
        </li>
      );
    });

    var href = '/'+this.props.guide.slug+'/'+this.props.section.slug;

    return (
      <li className="DrawerSectionsListItem" data-selected={this.props.selected}>
        <a onClick={this.handleClick.bind(this, href)} href={href}>
          <span>{this.props.section.title || 'Untitled'}</span>
        </a>
        <ul ref="children">
          {children}
          <li className="addSection">
            <Icon name={this.state.input.icon} />
            <input onFocus={this.handleInputFocus} onBlur={this.handleInputBlur} type="text" ref="input" placeholder={this.state.input.placeholder} onKeyUp={this.handleKeyUp} />
          </li>
        </ul>
      </li>
    );
  }
});