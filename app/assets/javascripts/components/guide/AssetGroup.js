/** @jsx React.DOM */

var React = require('react');
var moment = require('moment');
var Icon = require('../Icon');
var Button = require('../Button');

var AssetGroup = module.exports = React.createClass({
  getInitialState: function() {
    return {
      displayMode: 'thumb',
      selectedAssets: []
    }
  },
  toggleDisplayMode: function() {
    var displayMode;

    if(this.state.displayMode === 'thumb') displayMode = 'list';
    if(this.state.displayMode === 'list')  displayMode = 'grid';
    if(this.state.displayMode === 'grid')  displayMode = 'thumb';

    this.setState({ displayMode: displayMode });
  },
  toggleAssetSelection: function(id, event) {
    var selectedAssets = this.state.selectedAssets;

    if(selectedAssets.indexOf(id) === -1) {
      selectedAssets.push(id);
    } else {
      selectedAssets.splice(selectedAssets.indexOf(id), 1);
    }

    this.setState({ selectedAssets: selectedAssets });
  },
  render: function() {
    var self = this;

    var mtime = moment.unix(this.props.assetGroup.mtime).fromNow();

    var displayModeIcon;
    if(this.state.displayMode === 'list') displayModeIcon = 'rows';
    if(this.state.displayMode === 'grid') displayModeIcon = 'thumbnails';
    if(this.state.displayMode === 'thumb') displayModeIcon = 'stop';

    var assets = this.props.assetGroup.assets.map(function(asset) {
      var style = {
        backgroundImage: 'url('+asset.images.thumbnail+')'
      }

      var selected = self.state.selectedAssets.indexOf(asset.id) !== -1;

      return (
        <li className="asset" key={asset.id} data-selected={selected} data-pick={asset.pick}>
          <div className="image" style={style}>
            <input type="checkbox" className="selectImage" checked={selected} onChange={self.toggleAssetSelection.bind(self, asset.id)} />
          </div>
          <div className="filename">
            <span className="name">{asset.name}</span>
            <span className="size">{asset.size}</span>
          </div>
        </li>
      );
    });

    return (
      <div className="AssetGroup">
        <header>
          <div className="symbol"></div>
          <div className="title">
            <input value={this.props.assetGroup.title} readOnly />
          </div>
          <div className="buttons">
            <Button icon="email" className="plain" />
            <Button icon="download" className="plain"/>
          </div>
        </header>
        
        <div className="assetsListContainer">
          <div className="meta">
            <div className="left">
              <h2>{assets.length} Files</h2>
              <span className="size">{this.props.assetGroup.size}</span>
            </div>
            <Button className="displayMode plain" icon={displayModeIcon} onClick={this.toggleDisplayMode} />
          </div>
          <ul className="assetsList" data-display-mode={this.state.displayMode}>{assets}</ul>
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