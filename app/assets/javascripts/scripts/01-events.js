

__document.ready(function() {

  set_breakpoint();
  
  // eventCheck for all browsers
  __mq.addEventListener('webkitTransitionEnd', set_breakpoint, true);
  __mq.addEventListener('MSTransitionEnd', set_breakpoint, true);
  __mq.addEventListener('oTransitionEnd', set_breakpoint, true);
  __mq.addEventListener('transitionend', set_breakpoint, true);

  $('[data-func="scroll_to"]').on("click", scroll_to);
  
  update_fastclick();

});