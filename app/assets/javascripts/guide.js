//= require jquery
//= require fixedsticky
//= require_self

$('nav.sections').fixedsticky();

var tinycolor = require('tinycolor2');

var guideColour = tinycolor(window.guide.colour);

$('header#banner').css({
  backgroundColor: '#'+guideColour.toHex(),
  color: tinycolor.mostReadable(guideColour, ['white', 'black'])
});