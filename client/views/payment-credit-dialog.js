// PaymentCreditDialogView shows controls for entering a credit card.
function PaymentCreditDialogView(args) {
  DialogView.call(this, args);
  this.cardNumber = args.cardNumber;
  this.cardExpMonth = args.cardExpMonth;
  this.cardExpYear = args.cardExpYear;
  this.customerName = null;
}
PaymentCreditDialogView.prototype = Object.create(DialogView.prototype);

// setCard populates controls with data from card.
PaymentCreditDialogView.prototype.setCard = function(card) {
  this.customerName = card.customerName;
  this.cardNumber.value = card.cardNumber || '';
  this.cardExpMonth.value = card.expMonth || '';
  this.cardExpYear.value = card.expYear || '';
};

// getCard returns a CreditCard object with values read from controls.
PaymentCreditDialogView.prototype.getCard = function() {
  return new CreditCard({
    customerName: this.customerName,
    cardNumber: this.cardNumber.value,
    expMonth: this.cardExpMonth.value,
    expYear: this.cardExpYear.value,
  });
}
