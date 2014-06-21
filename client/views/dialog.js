// DialogView shows a modal dialog box.
function DialogView(args) {
  this.box = args.box;
}

DialogView.prototype.show = function() {
  this.box.classList.remove('hidden');
};

DialogView.prototype.hide = function() {
  this.box.classList.add('hidden');
};
