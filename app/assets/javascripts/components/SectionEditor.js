/** @jsx React.DOM */

var React = require('react');

var moment = require('moment');

var Button = require('./Button');
var ButtonGroup = require('./ButtonGroup');
var Icon = require('./Icon');

var GuideEditor = require('./GuideEditor');
var AssetGroupsList = require('./AssetGroupsList');
var ColoursList = require('./ColoursList');

var GuideStore = require('../GuideStore');
var Dispatcher = require('../Dispatcher');

var SectionEditor = module.exports = React.createClass({
  componentDidMount: function() {
    var self = this;

    this.mtimeTicker = setInterval(function() {
      self.forceUpdate();
    }, 10000);
  },
  componentWillUnmount: function() {
    clearInterval(this.mtimeTicker);
  },
  deleteSection: function() {
    if(confirm('Are you sure?')) {
      var self = this;
      var guide = GuideStore.find(this.props.guide.slug);

      guide.deleteSection(this.props.section.slug, function() {
        Dispatcher.emit('navigate', '/'+self.props.guide.slug);
      });
    }
  },
  changeTitle: function(event) {
    var guide = GuideStore.find(this.props.guide.slug);
    guide.updateSection(this.props.section.slug, { title: event.target.value });
  },
  saveChanges: function(event) {
    event.preventDefault();
    var guide = GuideStore.find(this.props.guide.slug);

    guide.sync();
  },
  addAssetGroup: function() {
    var guide = GuideStore.find(this.props.guide.slug);
    guide.addAssetGroupToSection(this.props.section.slug);
  },
  addColour: function() {
    var guide = GuideStore.find(this.props.guide.slug);
    guide.addColourToSection(this.props.section.slug);
  },
  render: function() {
    var self = this;

    var showAssetGroupsList = showColoursList = false;
    
    if(this.props.section) {
      var mtime = moment.unix(this.props.section.mtime).fromNow();

      if(this.props.section.asset_groups && this.props.section.asset_groups.length) showAssetGroupsList = true;
      if(this.props.section.colours && this.props.section.colours.length) showColoursList = true;

      var viewComponent = (
        <div>
          <form onSubmit={this.saveChanges}>
            <span className="mtime"><Icon name="clock" /> Updated {mtime}</span>
            <input className="input titleInput" value={this.props.section.title} type="text" onChange={this.changeTitle} placeholder="Title" />
            
            <div className="assetsColours">
              <AssetGroupsList
                onAssetGroupDeleted={this.props.onAssetGroupDeleted}
                onAssetUploaded={this.props.onAssetUploaded}
                guide={this.props.guide}
                section={this.props.section}
                show={showAssetGroupsList} />

              <ColoursList
                colours={this.props.section.colours}
                guide={this.props.guide}
                section={this.props.section}
                show={showColoursList} />

            </div>
            
            <ButtonGroup>
              <Button onClick={this.addAssetGroup} text="Add Asset Group" icon="attachment" />
              <Button onClick={this.addColour} text="Add Colour" icon="eyedropper" />
              <span className="spacer" />
              <Button onClick={this.deleteSection} text="Delete Page" icon="trash" />
              <Button onClick={this.saveChanges} className="green" text="Save Changes" icon="check" />
            </ButtonGroup>
          </form>
        </div>
      );
    } else {
      viewComponent = (<GuideEditor guide={this.props.guide} />);
    }

    return (
      <div className="SectionEditor">
        <div className="content">
          {viewComponent}
        </div>
      </div>
    );
  }
});