//= require jquery
//= require fixedsticky
//= require_self

var AssetGroupsList = require('./components/AssetGroupsList');

$('nav.sections').fixedsticky();

var tinycolor = require('tinycolor2');

var primary = tinycolor(window.guide.primary);

$('header#banner').css({
  backgroundColor: '#'+primary.toHex(),
  color: tinycolor.mostReadable(primary, ['white', 'black'])
});

// Make browserify and react-rails play nicely
window.React = require('react');
window.AssetGroupsList = AssetGroupsList;
require('./react_ujs')();