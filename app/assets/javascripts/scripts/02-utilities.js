

// generic scroll to anchor function
var scroll_to = function(e) {
    
  var target = $($(this).attr('href'));
  if (target.offset()) {
    __htmlbody.animate({scrollTop: target.offset().top + 'px'}, 600);
  }
  e.preventDefault();
}

// custom fastclick function...
function update_fastclick() {
  var fastclick_elements = $('[data-fastclick]');
  fastclick_elements.each(function(index) {
    FastClick.attach(this);
  });
}
