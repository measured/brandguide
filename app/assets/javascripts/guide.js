//= require jquery
//= require fixedsticky
//= require_self

$('nav.sections').fixedsticky();

var tinycolor = require('tinycolor2');

var primary = tinycolor(window.guide.primary);

$('header#banner').css({
  backgroundColor: '#'+primary.toHex(),
  color: tinycolor.mostReadable(primary, ['white', 'black'])
});