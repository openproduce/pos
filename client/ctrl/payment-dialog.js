// PaymentDialogController runs a dialog box for entering payment info.
function PaymentDialogController(args) {
  this.view = args.view;
  this.sale = args.sale;
  this.dialogController = args.dialogController;
  this.listController = new ListController({view: args.view.list});
  this.listController.update(['cash', 'credit/debit', 'tab', 'link', 'check']);
  this.paySale = args.paySale;
  this.changeMaker = new ChangeMaker({
    tendered: this.view.tendered,
    due: this.view.due,
    total: this.sale.total
  });
  this.customerId = this.sale.customerId;
  this.card = null;
  this.linkInfo = null;
  this.magstripeReader = args.magstripeReader;
  this.accept = null;
  this.cancel = null;

  this.view.setTotal(this.sale.total);
  this.view.setPreTaxTotal(this.sale.preTaxTotal);
}

// esc dismisses the dialog when the user presses escape.
PaymentDialogController.prototype.esc = function() {
  this.card = null;
  this.cancel();
  return true;
};

// enter is called when the user presses enter on a payment method.
// It prompts for more information for the chosen type of payment.
PaymentDialogController.prototype.enter = function() {
  var method = this.listController.getSelection();
  if (!method) return;
  if (method == 'credit/debit')
    this.promptCreditDebit(this.card);
  else if (method == 'tab')
    this.promptTab();
  else if (method == 'link')
    this.promptLink();
};

// fkey is called when the user presses the nth function key.
PaymentDialogController.prototype.fkey = function(n) {
  var method = this.listController.getSelection();
  if (!method) return;
  if (n == 6) {
    this.payAndPrintReceipt(method, false);
  } else if (n == 7) {
    this.payAndPrintReceipt(method, true);
  }
};

// tab toggles focus between the list and tendered box.
PaymentDialogController.prototype.tab = function() {
  if (document.activeElement == this.view.tendered) {
    this.view.tendered.blur();
    this.listController.focus();
  } else {
    this.view.tendered.focus();
    this.listController.blur();
  }
}

// up scrolls up in the list.
PaymentDialogController.prototype.up = function() {
  if (document.activeElement == this.view.tendered) {
    this.view.tendered.blur();
    this.listController.focus();
  } else {
    this.listController.up();
  }
};

// down scrolls up in the list.
PaymentDialogController.prototype.down = function() {
  if (!this.listController.down()) {
    this.listController.blur();
    this.view.tendered.focus();
  }
};

// swipe is called when a credit card is swiped.
PaymentDialogController.prototype.swipe = function(card) {
  this.listController.focus();
  this.listController.choose(1);
  this.promptCreditDebit(card);
};

// open opens the dialog box.
// Returns a promise resolved with choice or rejected if cancelled.
PaymentDialogController.prototype.open = function() {
  this.show();
  return new Promise(function(resolve, reject) {
    this.accept = resolve;
    this.cancel = reject;
  }.bind(this));
};

// show shows the dialog box.
PaymentDialogController.prototype.show = function() {
  this.listController.focus();
  this.changeMaker.bind();
  this.magstripeReader.bind(this.swipe.bind(this));
  this.view.show();
};

// hide hides the dialog box.
PaymentDialogController.prototype.hide = function() {
  this.listController.blur();
  this.changeMaker.unbind();
  this.magstripeReader.unbind();
  this.view.hide();
};

// payAndPrintReceipt completes a sale or prompts for more information.
PaymentDialogController.prototype.payAndPrintReceipt = function(method, withReceipt) {
  var payment = this.getPaymentChoice(method, withReceipt);
  if (!payment) {
    // We're missing some information needed for payment. Prompt for it again
    // by pressing enter on the selected payment type.
    this.enter();
    return;
  }

  this.dialogController.await(this.paySale(payment), 300, Messages.WAIT_FOR_SERVER)
      .catch(function(error) {
    this.dialogController.openAlert(error.display || Messages.ERROR_PAYING);
    return Promise.reject(error);
  }.bind(this)).then(function() {
    this.dialogController.close();
    this.accept();
  }.bind(this));
};

// getPaymentChoice rolls up payment data to send to the server.
PaymentDialogController.prototype.getPaymentChoice = function(method, withReceipt) {
  var fields = {
    'saleId': this.sale.id,
    'method': method,
    // Always include customerId for tab payments.
    'customerId': this.customerId,
    'creditCard': null,
    'linkInfo': null,
    'withReceipt': withReceipt
  };
  if (method == 'cash' || method == 'check')
    return new Payment(fields);
  if (method == 'tab' && this.customerId !== null)
    return new Payment(fields);
  if (method == 'link' && this.linkInfo) {
    fields['linkInfo'] = this.linkInfo;
    return new Payment(fields);
  }
  if (method == 'credit/debit' && this.card &&
      this.card.cardNumber && this.card.expMonth && this.card.expYear) {
    fields['creditCard'] = this.card;
    return new Payment(fields);
  }
};

// promptCreditDebit prompts for credit/debit payment info.
PaymentDialogController.prototype.promptCreditDebit = function(card) {
  this.dialogController.openPaymentCreditDialog(card)
      .catch(function() {
        this.card = null;
        this.listController.focus();
        this.listController.choose(0);
      }.bind(this))
      .then(function(card) {
        this.card = card;
      }.bind(this));
};

// promptTab prompts for a customer for a tab payment.
PaymentDialogController.prototype.promptTab = function() {
  this.dialogController.openCustomersDialog()
      .catch(function() {
        this.listController.focus();
        this.listController.choose(0);
      }.bind(this)).then(function(customer) {
        this.customerId = customer.id;
      }.bind(this));
};

// promptLink prompts for a link verification code.
PaymentDialogController.prototype.promptLink = function() {
  this.dialogController.openPaymentLinkDialog(this.sale.preTaxTotal, this.linkInfo)
      .catch(function() {
        this.linkInfo = null;
        this.listController.focus();
        this.listController.choose(0);
      }.bind(this)).then(function(linkInfo) {
        this.linkInfo = linkInfo;
      }.bind(this));
};
