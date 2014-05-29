/** @jsx React.DOM */

var React = require('react');

var $ = require('jquery');
var moment = require('moment');

var Icon = require('./Icon');
var Button = require('./Button');

var GuideStore = require('../GuideStore');

var AssetGroup = module.exports = React.createClass({
  getInitialState: function() {
    return {
      drag: null,
      displayMode: (this.props.public ? 'thumb' : 'list'),
      displayModeStates: ['thumb', 'list', 'grid'],
      displayModeIcons: ['stop', 'rows', 'thumbnails'],
      selectedAssets: [],
      buttonState: null
    }
  },
  changeTitle: function(event) {
    var guide = GuideStore.find(this.props.guide.slug);
    guide.updateSectionAssetGroup(this.props.section.slug, this.props.assetGroup.id, { title: event.target.value });
  },
  handleInputKeyUp: function(event) {
    if([27,13].indexOf(event.keyCode) !== -1) event.target.blur();
  },
  handleDelete: function(event) {
    var guide = GuideStore.find(this.props.guide.slug);
    guide.deleteAssetGroup(this.props.section.slug, this.props.assetGroup.id);
  },
  handleDragStart: function(event) {
    event.preventDefault();
    event.dataTransfer.effectAllowed = 'copyMove';
    this.setState({ drag: 'start' });
  },
  handleDragEnter: function(event) {
    event.preventDefault();
    this.setState({ drag: 'enter' });
  },
  handleDragOver: function(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    this.setState({ drag: 'over' });
  },
  handleDragLeave: function(event) {
    event.preventDefault();
    this.setState({ drag: 'leave' });
  },
  handleDrop: function(event) {
    event.stopPropagation();
    event.preventDefault();

    var guide = GuideStore.find(this.props.guide.slug);

    guide.uploadAssets(this.props.section.slug, this.props.assetGroup.id, event.dataTransfer.files);

    this.setState({ drag: 'drop' });
  },
  toggleDisplayMode: function() {
    var current = this.state.displayMode;
    var list = this.state.displayModeStates;
    
    var displayMode = (list[list.indexOf(current)+1] || list[0]);

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
  deleteSelectedAssets: function() {
    var guide = GuideStore.find(this.props.guide.slug);
    guide.deleteAssets(this.props.section.slug, this.props.assetGroup.id, this.state.selectedAssets);
    this.setState({ selectedAssets: [] });
  },
  selectAllAssets: function() {
    var assetIds = this.props.assetGroup.assets.map(function(asset) {
      return asset.id;
    });

    this.setState({ selectedAssets: assetIds })
  },
  handleDownload: function() {
    var assetIds = this.state.selectedAssets;
    
    if(!assetIds.length) assetIds = this.props.assetGroup.assets.map(function(asset) {
      return asset.id;
    });

    $.post('/bundles.json', { asset_ids: assetIds }).done(function(response) {
      if(response.status === 'success') {
        var key = response.data.bundle.access_key;
        window.location.href = 'bundles/'+key+'/download.zip';
      } else {
        alert(response.message);
      }
    });
  },
  handleEmail: function() {
    var recipients;

    if(recipients = prompt('Enter email recipient')) {
      var assetIds = this.state.selectedAssets;
    
      if(!assetIds.length) assetIds = this.props.assetGroup.assets.map(function(asset) {
        return asset.id;
      });
      
      $.post('/bundles.json', { asset_ids: assetIds, recipients: recipients }).done(function(response) {
        if(response.status === 'success') {
          alert('Asset bundle delivered.');
        } else {
          alert(response.message);
        }
      });
    }
  },
  render: function() {
    var self = this;

    var mtime = moment.unix(this.props.assetGroup.mtime).fromNow();

    var modeIndex = this.state.displayModeStates.indexOf(this.state.displayMode);
    var displayModeIcon = this.state.displayModeIcons[modeIndex];

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

    var deleteButtonStyle = {
      display: this.state.selectedAssets.length ? 'inline-block' : 'none'
    }

    if(this.props.public) deleteButtonStyle.display = 'none';

    return (
      <div
        className="AssetGroup"
        onDragStart={this.handleDragStart}
        onDragEnter={this.handleDragEnter}
        onDragOver={this.handleDragOver}
        onDrop={this.handleDrop}
        onDragLeave={this.handleDragLeave}
        data-drag-state={this.state.drag}
        data-public={!!this.props.public}>
        
        <div className="dropHint">
          <div>
            <Icon name="upload" />
            <span>Drop to upload files</span>
          </div>
        </div>
        
        <header>
          <div className="symbol"></div>
          <div className="title">
            <input value={this.props.assetGroup.title} onKeyUp={this.handleInputKeyUp} onChange={this.changeTitle} readOnly={this.props.public} />
          </div>
          <div className="buttons">
            <Button icon="email" className="email plain" onClick={this.handleEmail} />
            <Button icon="download" className="download plain" onClick={this.handleDownload} />
            <Button icon="delete" className="delete plain" onClick={this.handleDelete} />
          </div>
        </header>
        
        <div className="assetsListContainer">
          <div className="meta">
            <div className="left">
              <h2>{assets.length} {assets.length === 1 ? 'File' : 'Files'}</h2>
              <span className="size">{this.props.assetGroup.size}</span>
              <Button onClick={this.deleteSelectedAssets} style={deleteButtonStyle} className="plain delete" text={this.state.selectedAssets.length} icon="trash" />
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