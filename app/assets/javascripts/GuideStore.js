var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');

var GuideModel = require('./GuideModel');

var GuideStore = module.exports = _.extend(_.clone(Backbone.Events), {
  collection: [],
  selected: {},
  parse: function(response) {
    this.collection = _.map(response.data.guides, function(attributes) {
      var guide = new GuideModel;
      guide = guide.parse({ data: { guide: attributes }})
      return guide;
    });

    this.trigger('change');
  },
  fetch: function() {
    $.get('/guides.json', this.parse.bind(this))
  },
  attributes: function() {
    return this.collection.map(function(guide) {
      return guide.attributes;
    });
  },
  find: function(id) {
    var selections = _.select(this.collection, function(guide) {
      return guide.attributes.slug === id;
    });

    return selections.length ? selections[0] : new GuideModel({});
  }
});