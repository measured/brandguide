/** @jsx React.DOM */

var React = require('react');
var AssetGroup = require('./AssetGroup');

var AssetGroupsList = module.exports = React.createClass({
  render: function() {
    var assetGroups = this.props.assetGroups.map(function(assetGroup) {
      return <AssetGroup key={assetGroup.id} assetGroup={assetGroup} />
    });

    return (
      <div className="AssetGroupsList">
        <div className="container">
          {assetGroups}
        </div>
      </div>
    )
  }
});