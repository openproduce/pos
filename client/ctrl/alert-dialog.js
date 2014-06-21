// AlertDialogController
function AlertDialogController(args) {
  this.view = args.view;
  this.isPrompt = args.isPrompt;
  this.view.setMessage(args.text);
  this.accept = null;
  this.cancel = null;
}

// esc dismisses the dialog when the user presses escape.
AlertDialogController.prototype.esc = function() {
  this.cancel();
  return true;
};

// enter accepts the dialog prompt when the user presses enter, if it's a
// prompt (otherwise it is just a message and can't be accepted).
AlertDialogController.prototype.enter = function() {
  if (this.isPrompt) {
    this.accept();
    return true;
  }
};

// open opens the dialog box.
AlertDialogController.prototype.open = function() {
  this.show();
  return new Promise(function(resolve, reject) {
    this.accept = resolve;
    this.cancel = reject;
  }.bind(this));
};

// show shows the dialog box.
AlertDialogController.prototype.show = function() {
  this.view.show();
  if (this.isPrompt)
    this.view.showPrompt();
};

// hide hides the dialog box.
AlertDialogController.prototype.hide = function() {
  this.view.hide();
  this.view.hidePrompt();
};
