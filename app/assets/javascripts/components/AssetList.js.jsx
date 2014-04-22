/** @jsx React.DOM */

var AssetList = React.createClass({
  getInitialState: function() {
    return {
      assets: this.props.assets,
      buttons: this.props.buttons
    }
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({ buttons: nextProps.buttons })
  },
  downloadClicked: function() {
    var assetIds = this.state.assets.map(function(asset) {
      if(asset.selected) return asset.id;
    }).filter(function(id) {
      return id;
    });

    window.location = this.props.downloadUrl + '?asset_ids=' + assetIds;
  },
  toggle: function(toggledAsset) {
    updatedAssets = this.state.assets.map(function(asset) {
      if(asset === toggledAsset) {
        asset.selected = !asset.selected;
      }

      return asset;
    });

    this.setState({ assets: updatedAssets });
  },
  render: function() {
    var classSet = React.addons.classSet({
      AssetList: true,
      opened: (this.state.buttons.download || this.state.buttons.email)
    });

    var emailButtonStyle = {
      display: this.state.buttons.email ? 'inline-block' : 'none'
    }

    var downloadButtonStyle = {
      display: this.state.buttons.download ? 'inline-block' : 'none'
    }

    return <div className={classSet}>
      <div className="inner">
        <ul>
          {this.state.assets.map(function(asset) {
            return <AssetListItem key={asset.id} data={asset} onToggle={this.toggle.bind(this, asset)} />
          }.bind(this))}
        </ul>

        <form className="EmailForm" style={emailButtonStyle}>
          <input className="input" type="text" placeholder="Recipient" />
          <textarea className="input" placeholder="Message" />
        </form>

        <div className="buttons">
          <Btn style={emailButtonStyle} onClick={this.emailClicked} icon="Email">Email Selected Files</Btn>
          <Btn style={downloadButtonStyle} onClick={this.downloadClicked} icon="Download">Download Selected Files</Btn>
        </div>
      </div>
    </div>;
  }
});