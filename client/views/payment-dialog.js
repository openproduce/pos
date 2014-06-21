// PaymentDialogView shows a dialog prompting the clerk to enter payment info.
function PaymentDialogView(args) {
  DialogView.call(this, args);
  this.list = new ListView({
    dom: args.list,
    template: new PaymentChoiceTemplate()
  });
  this.total = new TextView(args.total);
  this.preTaxTotal = new TextView(args.preTaxTotal);
  // These are read and updated by ChangeMaker.
  this.tendered = args.tendered;
  this.due = new TextView(args.due);
}
PaymentDialogView.prototype = Object.create(DialogView.prototype);

// setTotal displays the total due for the sale.
PaymentDialogView.prototype.setTotal = function(total) {
  this.total.set(money(total));
};

// setPreTaxTotal displays the total due for the sale less any taxes.
PaymentDialogView.prototype.setPreTaxTotal = function(preTaxTotal) {
  this.preTaxTotal.set(money(preTaxTotal));
};
