/** @jsx React.DOM */

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