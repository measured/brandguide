/** @jsx React.DOM */

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