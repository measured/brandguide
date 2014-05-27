/** @jsx React.DOM */

var React = require('react');

var Icon = require('./Icon');

var DrawerSectionsListItem = require('./DrawerSectionsListItem');

var GuideStore = require('../GuideStore');

var DrawerSectionsList = module.exports = React.createClass({
  getInitialState: function() {
    return {
      input: {
        icon: 'plus',
        placeholder: 'Add Page'
      }
    }
  },
  handleKeyUp: function() {
    var input = this.refs.input.getDOMNode();

    if(event.keyCode === 13) {
      GuideStore.find(this.props.guide.slug).addSection(input.value, null);
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
  render: function() {
    var self = this;

    var sections = (this.props.guide.sections || []);

    var drawerSectionsListItems = sections.map(function(section) {
      if(section.parent_id) return;

      var selected = self.props.section ?
        (self.props.section.slug === section.slug) || (section.id === self.props.section.parent_id) :
        false;
      
      return (
        <DrawerSectionsListItem
          key={section.id}
          section={section}
          guide={self.props.guide}
          selected={selected} />
      );
    });

    return (
      <ul className="DrawerSectionsList">
        {drawerSectionsListItems}
        <li className="addSection">
          <Icon name={this.state.input.icon} /><input onFocus={this.handleInputFocus} onBlur={this.handleInputBlur} type="text" ref="input" placeholder={this.state.input.placeholder} onKeyUp={this.handleKeyUp} />
        </li>
      </ul>
    );
  }
});