//= require jquery
//= require jquery.bez
//= require fixedsticky
//= require_self

var React = require('react');

var ColoursList = require('./components/ColoursList');
var AssetGroupsList = require('./components/AssetGroupsList');

$('nav.sections').fixedsticky().on('click', 'a', function(event) {
  event.preventDefault();

  $anchor = $(event.target.hash);

  $('html, body').animate({ scrollTop: $anchor.offset().top }, 500, $.bez([0.190, 1.000, 0.220, 1.000]));
});

var tinycolor = require('tinycolor2');

var primary = tinycolor(window.guide.primary);

$('header#banner').css({
  backgroundColor: '#'+primary.toHex(),
  color: tinycolor.mostReadable(primary, ['white', 'black'])
});

// Make browserify and react-rails play nicely
window.React = React;
window.AssetGroupsList = AssetGroupsList;
window.ColoursList = ColoursList;

require('./react_ujs')();