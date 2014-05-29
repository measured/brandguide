/** @jsx React.DOM */

var React = require('react');
var moment = require('moment');

var GuideStore = require('../GuideStore');

var ButtonGroup = require('./ButtonGroup');
var Button = require('./Button');
var Icon = require('./Icon');

var GuideEditor = module.exports = React.createClass({
  componentDidMount: function() {
    var self = this;

    this.mtimeTicker = setInterval(function() {
      self.forceUpdate();
    }, 10000);
  },
  componentWillUnmount: function() {
    clearInterval(this.mtimeTicker);
  },
  changeTitle: function(event) {
    var guide = GuideStore.find(this.props.guide.slug);

    guide.attributes.title = event.target.value;
    GuideStore.trigger('change');
  },
  changeContent: function(event) {
    var guide = GuideStore.find(this.props.guide.slug);

    guide.attributes.content = event.target.value;
    GuideStore.trigger('change');
  },
  changePassword: function(event) {
    var guide = GuideStore.find(this.props.guide.slug);

    guide.attributes.password = event.target.value;
    GuideStore.trigger('change');
  },
  saveChanges: function(event) {
    event.preventDefault();
    var guide = GuideStore.find(this.props.guide.slug);

    guide.sync();
  },
  render: function() {
    var mtime = moment.unix(this.props.guide.mtime).fromNow();

    return (
      <div className="GuideEditor">
        <form onSubmit={this.saveChanges}>
          <span className="mtime"><Icon name="clock" /> Updated {mtime}</span>
          <input className="input titleInput" value={this.props.guide.title} placeholder="Title" onChange={this.changeTitle} />
          
          <div className="metaInputs">
            <div className="inputWithLabel">
              <label>Subdomain</label>
              <input type="text" className="input slugInput" value={this.props.guide.slug} placeholder="Subdomain" readOnly />
            </div>
            
            <div className="inputWithLabel">
              <label>Access Password</label>
              <input type="password" className="input passwordInput" value={this.props.guide.password} placeholder="None" onChange={this.changePassword} />
            </div>
          </div>

          <textarea className="input contentInput" value={this.props.guide.content} placeholder="Introduction" onChange={this.changeContent} />

          <div className="assetsColours"></div>

          <ButtonGroup>
            <span className="spacer" />
            <Button onClick={this.deleteGuide} text="Delete Guide" icon="trash" />
            <Button onClick={this.saveChanges} className="green" text="Save Changes" icon="check" />
          </ButtonGroup>
        </form>
      </div>
    );
  }
});