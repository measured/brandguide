/** @jsx React.DOM */

var Btn = React.createClass({
  onClick: function(event) {
    event.preventDefault();
    this.props.onClick();
  },
  render: function() {
    return this.transferPropsTo(
      <a className="Btn" href="#" onClick={this.onClick}>
        <i className="ss-icon">{this.props.icon}</i><span>{this.props.children}</span>
      </a>
    );
  }
});

var AssetListItem = React.createClass({
  render: function() {
    var checkboxId = 'asset-list-item--' + this.props.key;

    return <li className="AssetListItem">
      <input type="checkbox" id={checkboxId} onChange={this.props.onToggle} checked={this.props.data.selected} />
      <label htmlFor={checkboxId}>{this.props.data.name}</label>
    </li>;
  }
});

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

var AssetGroupHeader = React.createClass({
  getInitialState: function() {
    return { buttons: this.props.buttons }
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({ buttons: nextProps.buttons });
  },
  emailClicked: function(event) {
    event.preventDefault();
    this.props.onButtonClick({ email: !this.state.buttons.email, download: false });
  },
  downloadClicked: function(event) {
    event.preventDefault();
    this.props.onButtonClick({ download: !this.state.buttons.download, email: false });
  },
  render: function() {
    var emailClass = React.addons.classSet({
      'ss-icon': true,
      active: this.props.buttons.email
    });

    var downloadClass = React.addons.classSet({
      'ss-icon': true,
      active: this.props.buttons.download
    });

    return <div className="AssetGroupHeader">
      <div className="title">{this.props.title}</div>
      <div className="buttons">
        <a href="#" onClick={this.emailClicked} className={emailClass}>Email</a>
        <a href="#" onClick={this.downloadClicked} className={downloadClass}>Download</a>
      </div>
    </div>;
  }
});

var AssetGroup = React.createClass({
  getInitialState: function() {
    return {
      buttons: {
        download: false,
        email: false
      }
    }
  },
  handleButtonClick: function(buttonState) {
    this.setState({ buttons: buttonState });
  },
  render: function() {
    var thumbStyle = {
      backgroundImage: 'url('+this.props.thumb+')'
    }
    
    return <figure className="AssetGroup">
      <AssetGroupHeader title={this.props.title} buttons={this.state.buttons} onButtonClick={this.handleButtonClick} />
      <div className="AssetGroupThumbnail" style={thumbStyle} />
      <AssetList assets={this.props.assets} downloadUrl={this.props.download_url} buttons={this.state.buttons} />
    </figure>;
  }
});