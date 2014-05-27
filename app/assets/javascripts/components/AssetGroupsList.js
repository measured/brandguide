/** @jsx React.DOM */

var React = require('react');

var AssetGroup = require('./AssetGroup');

var AssetGroupsList = module.exports = React.createClass({
  render: function() {
    var self = this;

    var assetGroups = (this.props.asset_groups || this.props.section.asset_groups || []).map(function(group) {
      return (
        <AssetGroup
          key={group.id}
          assetGroup={group}
          section={self.props.section}
          guide={self.props.guide}
          public={self.props.public} />
      );
    });

    var assetGroupsContainer;

    if(assetGroups.length) {
      assetGroupsContainer = (
        <div className="container">
          {assetGroups}
        </div>
      );
    }

    return (
      <div className="AssetGroupsList">
        {assetGroupsContainer}
      </div>
    );
  }
});