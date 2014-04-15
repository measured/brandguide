//= require 01-fastclick
//= require 02-jquery
//= require 03-transit

//= require jquery_ujs
//= require jquery.ui.all

//= require scripts/00-vars
//= require scripts/01-events
//= require scripts/02-utilities
//= require scripts/03-breakpoints

$('.sections--order').sortable({
  update: function(event) {
    var result = $(this).children().map(function(index) {
      return $(this).attr('data-id');
    }).toArray();

    $.post($(this).attr('data-sort-path'), { sort: result });
  }
});