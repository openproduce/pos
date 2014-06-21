// A Wait dialog waits until a promise is fulfilled and then closes itself.
// It may delay a while before showing a message explaining what is being
// waited for. Pressing escape closes the dialog immediately and rejects its
// promise, though it doesn't cancel whatever it was waiting for.
function WaitDialogController(args) {
  this.view = args.view;
  this.promise = args.promise;
  this.timeBeforeMessage = args.timeBeforeMessage;
  this.dialogController = args.dialogController;
  this.view.setMessage(args.text);
  this.cancel = null;
}

// esc dismisses the dialog when the user presses escape.
WaitDialogController.prototype.esc = function() {
  this.cancel();
  // Not returning true here since cancel will close.
};

// open opens the dialog box.
WaitDialogController.prototype.open = function(hidePrev) {
  var closed = false;
  // Show a message explaining what we're waiting for after a timeout.
  setTimeout(function() {
    if (!closed) {
      if (hidePrev)
        hidePrev();
      this.show();
    }
  }.bind(this), this.timeBeforeMessage);
  var close = function() {
    closed = true;
    this.dialogController.close();
  }.bind(this);
  // Finishing closes this box.
  this.promise.then(close, close);
  var dialogPromise = new Promise(function(resolve, reject) {
    this.cancel = function() {
      close();
      reject();
    };
  }.bind(this));
  return Promise.race([dialogPromise, this.promise]);
};

// show shows the dialog box.
WaitDialogController.prototype.show = function() {
  this.view.show();
};

// hide hides the dialog box.
WaitDialogController.prototype.hide = function() {
  this.view.hide();
};
