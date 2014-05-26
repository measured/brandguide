var GuideModel = module.exports = function(attributes) {
  var $ = require('jquery');
  var _ = require('underscore');
  var Backbone = require('backbone');

  var clone = require('./clone');

  var GuideStore = require('./GuideStore');

  _.extend(this, Backbone.Events);

  if(typeof attributes === 'number') this.attributes = { id: attributes }
  if(typeof attributes === 'string') this.attributes = { slug: attributes }
  if(typeof attributes === 'object') this.attributes = attributes;
  
  this.fetch = function() {
    var slug = this.attributes.slug;
    $.get('/guides/'+slug+'.json').done(this.parse.bind(this));
  }

  this.parse = function(response) {
    this.attributes = response.data.guide;

    GuideStore.trigger('change');

    return this;
  }

  this.sync = function(callback) {
    var self = this;

    var attributes = clone(this.attributes);

    if(attributes.sections) {
      attributes.sections_attributes = clone(attributes.sections);
      delete attributes.sections;

      _.each(attributes.sections_attributes, function(section) {
        if(section.colours) {
          section.colours_attributes = clone(section.colours);
          delete section.colours;
        }

        if(section.asset_groups) {
          section.asset_groups_attributes = clone(section.asset_groups);
          delete attributes.asset_groups;
          
          _.each(section.asset_groups_attributes, function(asset_group) {
            if(asset_group.assets) {
              asset_group.assets_attributes = _.clone(asset_group.assets);
              delete asset_group.assets;
            }
          });
        }
      });  
    }
    
    var slug = this.attributes.slug;

    var postUrl = slug ? '/guides/'+slug+'.json' : '/guides.json';

    $.post(postUrl, {
      guide: attributes
    }).done(function(response) {
      if(response.guide) {
        self.parse(response);  
      } else {
        GuideStore.parse(response);
      }
      
      if(typeof callback === 'function') callback();
    });
  }

  this.findSection = function(id) {
    var selections = _.select(this.attributes.sections, function(section) {
      return section.slug === id;
    });

    return selections.length ? selections[0] : {};
  }

  this.childrenOfSection = function(id) {
    return _.select(this.attributes.sections, function(section) {
      return section.parent_id === id;
    });
  }

  this.addSection = function(title, parent, callback) {
    var parentId = parent ? this.findSection(parent).id : null;

    this.attributes.sections.push({
      title: title,
      parent_id: parentId
    });

    this.sync(callback);
  }

  this.deleteSection = function(id, callback) {
    var section = this.findSection(id);
    section._destroy = true;

    this.sync(callback);
  }

  this.updateSection = function(id, attributes) {
    var section = this.findSection(id);

    section = _.extend(section, attributes);

    GuideStore.trigger('change');
  }

  this.addAssetGroupToSection = function(id) {
    var section = this.findSection(id);
    section.asset_groups.push({
      title: 'Untitled',
      assets: []
    });

    GuideStore.trigger('change');
  }

  this.addColourToSection = function(id) {
    var section = this.findSection(id);
    section.colours.push({
      title: 'Untitled',
      hex: '#000000'
    });

    this.sync();
  }

  this.updateSectionColour = function(sectionId, colourId, attributes) {
    var section = this.findSection(sectionId);
    var colours = _.select(section.colours, function(colour) {
      return colour.id === colourId;
    });

    if(colours.length) {
      var colour = colours[0];

      colour = _.extend(colour, attributes);

      GuideStore.trigger('change');
    }
  }

  this.deleteSectionColour = function(sectionId, colourId) {
    var colour = this.findColour(sectionId, colourId);
    colour._destroy = true;

    this.sync();
  }

  this.findAssetGroup = function(sectionId, assetGroupId) {
    var section = this.findSection(sectionId);

    var selected = _.select(section.asset_groups, function(assetGroup) {
      return assetGroup.id === assetGroupId;
    });

    return selected.length ? selected[0] : {};
  }

  this.findColour = function(sectionId, colourId) {
    var section = this.findSection(sectionId);
    
    var selected = _.select(section.colours, function(colour) {
      return colour.id === colourId;
    });

    return selected.length ? selected[0] : {};
  }

  this.deleteAssetGroup = function(sectionId, assetGroupId) {
    var assetGroup = this.findAssetGroup(sectionId, assetGroupId);
    assetGroup._destroy = true;

    this.sync();
  }

  this.uploadAssets = function(sectionId, assetGroupId, files) {
    var formData = new FormData();

    _.each(event.dataTransfer.files, function(file) {
      formData.append('assets[][file]', file);
    });

    assetGroupId = assetGroupId ? assetGroupId : '';

    $.ajax({
      url: '/guides/'+this.attributes.slug+'/upload.json?section_id='+sectionId+'&asset_group_id='+assetGroupId,
      data: formData,
      processData: false,
      contentType: false,
      type: 'post'
    }).done(this.parse.bind(this));
  }

  this.updateSectionAssetGroup = function(sectionId, assetGroupId, attributes) {
    var assetGroup = this.findAssetGroup(sectionId, assetGroupId);

    assetGroup = _.extend(assetGroup, attributes);

    GuideStore.trigger('change');
  }

  this.deleteAssets = function(sectionId, assetGroupId, assetIds) {
    var assetGroup = this.findAssetGroup(sectionId, assetGroupId);

    _.each(assetGroup.assets, function(asset) {
      if(assetIds.indexOf(asset.id) !== -1) {
        asset._destroy = true;
      }
    });

    this.sync();
  }
}