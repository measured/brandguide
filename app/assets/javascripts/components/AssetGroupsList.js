/** @jsx React.DOM */

var React = require('react/addons');

var AssetGroup = require('./AssetGroup');

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var AssetGroupsList = module.exports = React.createClass({
  render: function() {
    var self = this;

    var assetGroups = (this.props.asset_groups || this.props.section.asset_groups || []).map(function(group) {
      return (
        <AssetGroup
          key={group.id || group.key}
          assetGroup={group}
          section={self.props.section}
          guide={self.props.guide}
          public={self.props.public} />
      );
    });

    var assetGroupsContainer;

    if(assetGroups.length) {
      assetGroupsContainer = (
        <ReactCSSTransitionGroup className="container" component={React.DOM.div} transitionName="pop">
          {assetGroups}
        </ReactCSSTransitionGroup>
      );
    }

    return (
      <div className="AssetGroupsList" data-show={this.props.show}>
        {assetGroupsContainer}
      </div>
    );
  }
});