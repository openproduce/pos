// PaymentLinkDialogController runs a dialog box for entering link payment info.
function PaymentLinkDialogController(args) {
  this.view = args.view;
  this.view.setPreTaxTotal(args.preTaxTotal);
  this.view.setLinkInfo(args.linkInfo || new LinkInfo({approvalCode: ''}));

  this.accept = null;
  this.cancel = null;
}

// esc dismisses the dialog when the user presses escape.
PaymentLinkDialogController.prototype.esc = function() {
  this.cancel();
  return true;
};

// fkey is called when the user presses the nth function key.
PaymentLinkDialogController.prototype.fkey = function(n) {
  if (n == 6) {
    var linkInfo = this.view.getLinkInfo();
    if (linkInfo && linkInfo.approvalCode) {
      this.accept(linkInfo);
      return true;
    }
  }
};

// open opens the dialog box.
// Returns a promise resolved with choice or rejected if cancelled.
PaymentLinkDialogController.prototype.open = function() {
  this.show();
  return new Promise(function(resolve, reject) {
    this.accept = resolve;
    this.cancel = reject;
  }.bind(this));
};

// show shows the dialog box.
PaymentLinkDialogController.prototype.show = function() {
  this.view.show();
  this.view.approvalCode.focus();
};

// hide hides the dialog box.
PaymentLinkDialogController.prototype.hide = function() {
  this.view.approvalCode.blur();
  this.view.hide();
};
