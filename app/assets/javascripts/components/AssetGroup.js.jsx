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
    var thumbStyle = {};

    if(this.props.thumb) {
      thumbStyle.backgroundImage = 'url('+this.props.thumb+')';
    }
    
    return <figure className="AssetGroup">
      <AssetGroupHeader title={this.props.title} buttons={this.state.buttons} onButtonClick={this.handleButtonClick} />
      <div className="AssetGroupThumbnailContainer">
        <div className="AssetGroupThumbnail" style={thumbStyle} />
      </div>
      <AssetList assets={this.props.assets} bundleUrl={this.props.bundle_url} buttons={this.state.buttons} />
    </figure>;
  }
});