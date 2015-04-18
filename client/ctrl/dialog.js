// DialogController proxies input events for a stack of modal dialogs.
function DialogController(args) {
  this.mask = args.mask;
  this.setClerk = args.setClerk;
  this.saleController = args.saleController;
  this.netController = args.netController;
  this.magstripeReader = args.magstripeReader;
  this.clearSale = args.clearSale;
  this.stealFocus = args.stealFocus;
  this.cedeFocus = args.cedeFocus;

  this.dialogs = [];
}

// enter is called when the user presses enter.
// Returns true if focus should be ceded back to the default views and false if
// the dialog controller should retain focus.
DialogController.prototype.enter = function() {
  var dialog = this.topDialog();
  if (dialog && dialog.enter) {
    if (dialog.enter()) {
      this.close();
    }
  }
  return this.dialogs.length == 0;
};

// esc is called when the user presses escape.
// Returns true if focus should be ceded back to the default views and false if
// the dialog controller should retain focus.
DialogController.prototype.esc = function() {
  var dialog = this.topDialog();
  if (dialog && dialog.esc) {
    if (dialog.esc()) {
      this.close();
    }
  }
  return this.dialogs.length == 0;
};

// left is called when the user presses left, and sends the key to the top dialog.
DialogController.prototype.left = function(e) {
  var dialog = this.topDialog();
  if (dialog && dialog.left)
    dialog.left(e);
};

// right is called when the user presses right, and sends the key to the top dialog.
DialogController.prototype.right = function(e) {
  var dialog = this.topDialog();
  if (dialog && dialog.right)
    dialog.right(e);
};

// up is called when the user presses up, and sends the key to the top dialog.
DialogController.prototype.up = function() {
  var dialog = this.topDialog();
  if (dialog && dialog.up)
    dialog.up();
};

// down is called when the user presses down, and sends the key to the top
// dialog.
DialogController.prototype.down = function() {
  var dialog = this.topDialog();
  if (dialog && dialog.down)
    dialog.down();
};

DialogController.prototype.tab = function(e) {
  var dialog = this.topDialog();
  if (dialog && dialog.tab)
    dialog.tab(e);
};

// fkey signals that the user pressed function key n.
// Returns true if a new dialog was opened and false otherwise.
DialogController.prototype.fkey = function(n) {
  var dialog = this.topDialog();
  if (!dialog)
    return this.openTopLevelDialog(n);
  if (dialog.fkey && dialog.fkey(n))
    this.close();
  return false;
};

// openTopLevelDialog opens dialogs when function keys are pressed in the main
// view.
DialogController.prototype.openTopLevelDialog = function(n) {
  if (n == 1) {
    this.pickClerk();
  } else if (n == 2) {
    this.pickCustomer();
  } else if (n == 5) {
    var sale = this.saleController.getSale();
    if (!sale) {
      this.openAlert(Messages.NO_CURRENT_SALE);
    } else {
      this.await(sale, 300, Messages.WAIT_FOR_SERVER).catch(function(error) {
        this.openAlert(error.display || Messages.ERROR_STORING_SALE);
        return Promise.reject(error);
      }.bind(this)).then(function(state) {
        return this.openPaymentDialog(state.sale);
      }.bind(this)).then(this.clearSale).catch(function(error) {
        logError(error);
      });
    }
  } else if (n == 8) {
    if (this.saleController.hasItems()) {
      this.openPrompt(Messages.PROMPT_CLEAR_SALE)
          .then(this.clearSale);
    } else {
      this.openAlert(Messages.NO_CURRENT_SALE);
    }
  } else if (n == 9) {
    var time = ReviewSalesDialogController.daysAgo(3);
    var recentSales = this.netController.getSalesSince(time);
    this.await(recentSales, 300, Messages.WAIT_FOR_SERVER).catch(function(error) {
      this.openAlert(error.display || Messages.ERROR_GETTING_SALES);
      return Promise.reject(error);
    }.bind(this)).then(function(sales) {
      if (!sales || !sales.length) {
        this.openAlert(Messages.NO_SALES);
      } else {
        this.openReviewSalesDialog(sales);
      }
    }.bind(this));
  } else {
    return false;
  }
  return true;
};

DialogController.prototype.pickClerk = function() {
  return this.openClerksDialog()
             .then(this.setClerk)
             .catch(function() { this.setClerk(null); }.bind(this));
};

DialogController.prototype.pickCustomer = function() {
  return this.openCustomersDialog()
             .then(function(customer) {
               this.saleController.setCustomer(customer);
             }.bind(this)).catch(function() {
               this.saleController.setCustomer(null);
             }.bind(this));
};

// open opens the given dialog.
DialogController.prototype.open = function(dialog) {
  this.stealFocus();
  var hide;
  if (!this.dialogs.length) {
    this.mask.show();
  } else {
    var prevDialog = this.dialogs[this.dialogs.length - 1];
    hide = prevDialog.hide.bind(prevDialog);
    if (!(dialog instanceof WaitDialogController))
      hide();
  }
  this.dialogs.push(dialog);
  return dialog.open(hide);
};

// close closes the topmost dialog.
DialogController.prototype.close = function() {
  var dialog = this.dialogs.pop();
  if (dialog)
    dialog.hide();
  if (!this.dialogs.length) {
    this.mask.hide();
    this.cedeFocus();
  } else {
    this.dialogs[this.dialogs.length - 1].show();
  }
};

// openClerksDialog opens a new clerk selection dialog.
// Returns a Promise resolved with clerk chosen or rejected if cancelled.
DialogController.prototype.openClerksDialog = function() {
  return this.open(new ClerksDialogController({
    view: new ListDialogView({
      box: dom('clerks'),
      searchField: dom('clerks-search-field'),
      list: dom('clerks-list'),
      template: new ClerkChoiceTemplate()
    }),
    dialogController: this,
    search: this.netController.searchClerks.bind(this.netController),
  }));
};

// openCustomersDialog shows a customer selection dialog.
// Returns a Promise resolved with customer chosen or rejected if cancelled.
DialogController.prototype.openCustomersDialog = function() {
  return this.open(new CustomersDialogController({
    view: new ListDialogView({
      box: dom('customers'),
      searchField: dom('customers-search-field'),
      list: dom('customers-list'),
      template: new CustomerChoiceTemplate()
    }),
    dialogController: this,
    search: this.netController.searchCustomers.bind(this.netController)
  }));
};

// openEditCustomersDialog shows a form to edit customer information.
DialogController.prototype.openEditCustomerDialog = function(customer) {
  return this.open(new EditCustomerDialogController({
    view: new EditCustomerDialogView({
      box: dom('edit-customer'),
      name: dom('edit-customer-name'),
      email: dom('edit-customer-email'),
      phone: dom('edit-customer-phone'),
      postal1: dom('edit-customer-postal1'),
      postal2: dom('edit-customer-postal2'),
      postal3: dom('edit-customer-postal3'),
      limit: dom('edit-customer-credit-limit'),
      balance: dom('edit-customer-balance-value')
    }),
    dialogController: this,
    getTabHistory: this.netController.getTabHistory.bind(this.netController),
    saveCustomer: customer ?
        this.netController.updateCustomer.bind(this.netController) :
        this.netController.createCustomer.bind(this.netController),
    customer: customer
  }));
};

// openPaymentDialog opens a dialog to pay for a sale. It assumes the sale has
// been committed to the server before it opens.
DialogController.prototype.openPaymentDialog = function(sale) {
  return this.open(new PaymentDialogController({
    view: new PaymentDialogView({
      box: dom('payment'),
      list: dom('payment-type-list'),
      total: dom('payment-total'),
      preTaxTotal: dom('payment-total-notax'),
      tendered: dom('payment-amount-tendered'),
      due: dom('payment-change-due')
    }),
    magstripeReader: this.magstripeReader,
    paySale: this.netController.paySale.bind(this.netController),
    sale: sale,
    dialogController: this
  }));
};

// openPaymentCreditDialog opens a dialog to enter credit card info either by
// typing it in or by swiping.
DialogController.prototype.openPaymentCreditDialog = function(card) {
  return this.open(new PaymentCreditDialogController({
    view: new PaymentCreditDialogView({
      box: dom('payment-credit'),
      cardNumber: dom('payment-credit-card'),
      cardExpMonth: dom('payment-credit-exp-month'),
      cardExpYear: dom('payment-credit-exp-year'),
    }),
    magstripeReader: this.magstripeReader,
    card: card
  }));
};

// openPaymentLinkDialog opens a dialog where the clerk can manually enter an
// approval code for Illinois Link.
DialogController.prototype.openPaymentLinkDialog = function(preTaxTotal, linkInfo) {
  return this.open(new PaymentLinkDialogController({
    view: new PaymentLinkDialogView({
      box: dom('payment-link'),
      amount: dom('payment-link-total'),
      approvalCode: dom('payment-link-approval')
    }),
    preTaxTotal: preTaxTotal,
    linkInfo: linkInfo
  }));
};

// openTabHistory displays a customer's tab history.
DialogController.prototype.openTabHistory = function(customer, sales) {
  return this.open(new TabHistoryDialogController({
    view: new TabHistoryDialogView({
      box: dom('tab-history'),
      msgNoHistory: dom('tab-history-message-none'),
      listWrapper: dom('tab-history-lists'), 
      saleList: dom('tab-history-sale-list'),
      saleItemList: dom('tab-history-sale-item-list')
    }),
    sales: sales,
    dialogController: this,
    customer: customer,
    printTab: this.netController.printTab.bind(this.netController)
  }));
};

// openReviewSalesDialog shows a list of recent sales and allows voiding or
// unvoiding them.
DialogController.prototype.openReviewSalesDialog = function(sales) {
  return this.open(new ReviewSalesDialogController({
    view: new ReviewSalesDialogView({
      box: dom('review-sales'),
      list: dom('review-sales-list')
    }),
    sales: sales,
    dialogController: this,
    printReceipt: this.netController.printReceipt.bind(this.netController),
    voidSale: this.netController.voidSale.bind(this.netController),
    unvoidSale: this.netController.unvoidSale.bind(this.netController)
  }));
};

// openAlert shows a generic message.
DialogController.prototype.openAlert = function(text) {
  return this.open(new AlertDialogController({
    view: new AlertDialogView({
      box: dom('alert'),
      message: dom('alert-message'),
      enterPrompt: dom('alert-enter-prompt')
    }),
    text: text,
    isPrompt: false
  })).catch(function() {});
};

// openPrompt shows a question with a yes or no answer.
DialogController.prototype.openPrompt = function(text) {
  return this.open(new AlertDialogController({
    view: new AlertDialogView({
      box: dom('alert'),
      message: dom('alert-message'),
      enterPrompt: dom('alert-enter-prompt')
    }),
    text: text,
    isPrompt: true
  }));
};

// await waits for something to happen before accepting more dialog actions.
DialogController.prototype.await = function(promise, timeBeforeMessage, text) {
  return this.open(new WaitDialogController({
    view: new WaitDialogView({
      box: dom('wait'),
      message: dom('wait-message'),
    }),
    text: text,
    dialogController: this,
    timeBeforeMessage: timeBeforeMessage,
    promise: promise
  }));
};

// topDialog returns the topmost open dialog, if any.
DialogController.prototype.topDialog = function() {
  return this.dialogs[this.dialogs.length - 1];
};
