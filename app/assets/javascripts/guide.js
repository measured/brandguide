//= require jquery
//= require jquery.bez
//= require fixedsticky
//= require_self

var React = require('react');

var ColoursList = require('./components/ColoursList');
var AssetGroupsList = require('./components/AssetGroupsList');

$(document).ready(function() {
  $('nav.sections').fixedsticky();

  $('nav.sections a').on('click', function(event) {
  event.preventDefault();

  $anchor = $(event.target.hash);

  $('html, body').animate({ scrollTop: $anchor.offset().top }, 500, $.bez([0.190, 1.000, 0.220, 1.000]));
  });

  var tinycolor = require('tinycolor2');

  var primary = tinycolor(window.guide.primary);

  var textColour = tinycolor.mostReadable(primary, ['white', 'black']);

  if(window.location.host.split('.')[0] === 'bex') textColour = 'white';

  $('header#banner').css({
    backgroundColor: '#'+primary.toHex(),
    color: textColour
  });
});

// Make browserify and react-rails play nicely
window.React = React;
window.AssetGroupsList = AssetGroupsList;
window.ColoursList = ColoursList;

require('./react_ujs')();