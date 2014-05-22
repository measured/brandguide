//= require jquery
//= require fixedsticky
//= require_self

window.csrfToken = $('meta[name=csrf-token]').prop('content');

$('nav.sections').fixedsticky();