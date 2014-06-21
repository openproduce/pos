// FocusRing moves system focus between a list of controls.
function FocusRing(order) {
  this.order = order;
}

// previous focuses the previous control in list order if any.
FocusRing.prototype.previous = function() {
  var cur = this.order.indexOf(document.activeElement);
  var prev = this.order[cur - 1];
  if (prev) prev.focus();
};

// next focuses the previous control in list order if any.
FocusRing.prototype.next = function() {
  var cur = this.order.indexOf(document.activeElement);
  var next = this.order[cur + 1];
  if (next) next.focus();
};
