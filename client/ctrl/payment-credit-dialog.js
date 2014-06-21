// PaymentCreditDialogController shows a dialog for entering credit card info.
function PaymentCreditDialogController(args) {
  this.view = args.view;
  this.magstripeReader = args.magstripeReader;
  this.filters = [
    new InputFilter({dom: this.view.cardNumber, allowNumbers: true}),
    new InputFilter({dom: this.view.cardExpMonth, allowNumbers: true}),
    new InputFilter({dom: this.view.cardExpYear, allowNumbers: true})
  ];
  this.focusRing = new FocusRing([
    this.view.cardNumber,
    this.view.cardExpMonth,
    this.view.cardExpYear
  ]);
  this.view.setCard(args.card || new CreditCard({
    cardNumber: '',
    customerName: '',
    expMonth: '',
    expYear: ''}));

  this.accept = null;
  this.cancel = null;
}

// esc dismisses the dialog when the user presses escape.
PaymentCreditDialogController.prototype.esc = function() {
  this.cancel();
  return true;
};

// enter is called when the user presses enter.
PaymentCreditDialogController.prototype.enter = function() {
};

// fkey is called when the user presses the nth function key.
PaymentCreditDialogController.prototype.fkey = function(n) {
  if (n == 6) {
    var card = this.view.getCard();
    if (card && card.cardNumber && card.expMonth && card.expYear) {
      this.accept(card);
      return true;
    }
  }
};

// tab moves focus to the next or previous element.
PaymentCreditDialogController.prototype.tab = function(e) {
  if (e.shiftKey)
    this.focusRing.previous();
  else
    this.focusRing.next();
}

// left focuses expiration month iff year focused.
PaymentCreditDialogController.prototype.left = function() {
  if (document.activeElement == this.view.cardExpYear)
    this.view.cardExpMonth.focus();
};

// right focuses expiration year iff month focused.
PaymentCreditDialogController.prototype.right = function() {
  if (document.activeElement == this.view.cardExpMonth)
    this.view.cardExpYear.focus();
};

// up moves focus to the previous element.
PaymentCreditDialogController.prototype.up = function() {
  this.focusRing.previous();
};

// down moves focus to the next element.
PaymentCreditDialogController.prototype.down = function() {
  this.focusRing.next();
};

// swipe is called when a card is swiped.
PaymentCreditDialogController.prototype.swipe = function(card) {
  this.view.setCard(card);
};

// open opens the dialog box.
// Returns a promise resolved with choice or rejected if cancelled.
PaymentCreditDialogController.prototype.open = function() {
  this.show();
  return new Promise(function(resolve, reject) {
    this.accept = resolve;
    this.cancel = reject;
  }.bind(this));
};

// show shows the dialog box.
PaymentCreditDialogController.prototype.show = function() {
  this.view.show();
  this.filters.forEach(function(filter) {
    filter.bind();
  });
  this.magstripeReader.bind(this.swipe.bind(this));
  this.view.cardNumber.focus();
};

// hide hides the dialog box.
PaymentCreditDialogController.prototype.hide = function() {
  this.view.cardNumber.blur();
  this.filters.forEach(function(filter) {
    filter.unbind();
  });
  this.magstripeReader.unbind();
  this.view.hide();
};
