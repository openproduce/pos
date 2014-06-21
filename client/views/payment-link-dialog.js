// PaymentLinkDialogView shows a dialog prompting for link payment details.
function PaymentLinkDialogView(args) {
  DialogView.call(this, args);
  this.amount = new TextView(args.amount);
  this.approvalCode = args.approvalCode;
}
PaymentLinkDialogView.prototype = Object.create(DialogView.prototype);

// setPreTaxTotal shows the sale total less tax.
PaymentLinkDialogView.prototype.setPreTaxTotal = function(preTaxTotal) {
  this.amount.set(money(preTaxTotal || 0));
};

// setLinkInfo populates controls with link payment info.
PaymentLinkDialogView.prototype.setLinkInfo = function(linkInfo) {
  this.approvalCode.value = linkInfo.approvalCode || '';
};

// getLinkInfo reads link payment info from controls.
PaymentLinkDialogView.prototype.getLinkInfo = function() {
  return new LinkInfo({approvalCode: this.approvalCode.value});
};
