// DialogMaskView draws a full-screen transparent gray mask over the sale and
// picker panes when a dialog view is shown.
function DialogMaskView(args) {
  this.mask = args.mask;
};

DialogMaskView.prototype.show = function() {
  this.mask.style.display = 'block';
}

DialogMaskView.prototype.hide = function() {
  this.mask.style.display = '';
}
