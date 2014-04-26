/** @jsx React.DOM */

var AssetList = React.createClass({
  getInitialState: function() {
    return {
      assets: this.props.assets,
      buttons: this.props.buttons,
      form: {
        recipient: '',
        message: '',
        request: null
      }
    }
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({ buttons: nextProps.buttons })
  },
  getSelectedAssetIds: function() {
    return this.state.assets.map(function(asset) {
      if(asset.selected) return asset.id;
    }).filter(function(id) {
      return id;
    });
  },
  downloadClicked: function() {
    $.post(this.props.bundleUrl, {
      authenticity_token: window.csrfToken,
      asset_bundle: {
        asset_ids: this.getSelectedAssetIds()
      }
    }, function(response, status, xhr) {
      window.location = response.download_url;
    });
  },
  emailClicked: function() {
    $.post(this.props.bundleUrl, {
      authenticity_token: window.csrfToken,
      asset_bundle: {
        asset_ids: this.getSelectedAssetIds(),
        recipient: this.state.form.recipient,
        message: this.state.form.message
      }
    }, function(response, status, xhr) {
      console.log(response, status, xhr);
    });
  },
  emailRecipientChanged: function(event) {
    var form = this.state.form;
    form.recipient = event.target.value;
    this.setState({ form: form });
  },
  emailMessageChanged: function(event) {
    var form = this.state.form;
    form.message = event.target.value;
    this.setState({ form: form });
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

    var emailButtonStyle = { display: this.state.buttons.email ? 'block' : 'none' }
    var downloadButtonStyle = { display: this.state.buttons.download ? 'block' : 'none' }

    var assetListItems = this.state.assets.map(function(asset) {
      return <AssetListItem
        key={asset.id}
        data={asset}
        onToggle={this.toggle.bind(this, asset)} />
    }.bind(this));

    var emailButtonDisabled = downloadButtonDisabled = true;

    if(this.getSelectedAssetIds().length) {
      var re = /\S+@\S+\.\S+/;
      if(re.test(this.state.form.recipient)) emailButtonDisabled = false;

      downloadButtonDisabled = false;
    }

    return <div className={classSet}>
      <div className="inner">
        <ul>{assetListItems}</ul>

        <form className="EmailForm" style={emailButtonStyle}>
          <input onChange={this.emailRecipientChanged} value={this.state.form.recipient} className="input" type="text" placeholder="Recipient" />
          <textarea onChange={this.emailMessageChanged} value={this.state.form.message} className="input" placeholder="Message" />
        </form>

        <div className="buttons">
          <Btn style={emailButtonStyle} onClick={this.emailClicked} icon="Email" disabled={emailButtonDisabled}>Email Selected Files</Btn>
          <Btn style={downloadButtonStyle} onClick={this.downloadClicked} icon="Download" disabled={downloadButtonDisabled}>Download Selected Files</Btn>
        </div>
      </div>
    </div>;
  }
});