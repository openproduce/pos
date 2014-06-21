// EditCustomerDialog allows the clerk to add or edit a customer.
function EditCustomerDialogController(args) {
  this.view = args.view;
  this.dialogController = args.dialogController;
  this.saveCustomer = args.saveCustomer;
  this.customer = args.customer || new Customer({
    id: null,
    name: '',
    phone: '',
    email: '',
    postal: '',
    balance: Big(0),
    limit: Big(0)
  });
  this.getTabHistory = args.getTabHistory;

  this.accept = null;
  this.resolve = null;
  this.view.setCustomer(this.customer);
  this.focusRing = new FocusRing([
    this.view.name,
    this.view.email,
    this.view.phone,
    this.view.postal1,
    this.view.postal2,
    this.view.postal3,
    this.view.limit
  ]);
};

// esc dismisses the dialog when the user presses escape.
EditCustomerDialogController.prototype.esc = function() {
  this.cancel();
  return true;
};

// validate checks whether edits are legal.
// Returns an error message if something is wrong or undefined otherwise.
EditCustomerDialogController.prototype.validate = function(edits) {
  if (!edits.name)
    return Messages.CUSTOMER_NAME_EMPTY;
  if (!edits.email && !edits.phone && !edits.postal)
    return Messages.CUSTOMER_CONTACT_EMPTY;
  try {
    var limit = Big(edits.limit);
    if (limit.lt(0))
      return Messages.CUSTOMER_LIMIT_BAD;
  } catch (e) {
    return Messages.CUSTOMER_LIMIT_BAD;
  }
};

// fkey is called when the user presses the nth function key.
EditCustomerDialogController.prototype.fkey = function(n) {
  if (n == 6)
    this.save();
  else if (n == 9)
    this.showTabHistory();
};

// save applies edits to the customer. It closes the dialog if successful,
// otherwise it pops up an error.
EditCustomerDialogController.prototype.save = function() {
  var edits = this.view.getEdits();
  var error = this.validate(edits);
  if (error) {
    this.dialogController.openAlert(error);
    return;
  }

  this.saveCustomer(new Customer({
    id: this.customer.id,
    name: edits.name,
    phone: edits.phone,
    email: edits.email,
    postal: edits.postal,
    balance: this.customer.balance,
    limit: Big(edits.limit)
  })).then(function(customer) {
    this.dialogController.close();
    this.accept(customer);
  }.bind(this)).catch(function(error) {
    this.dialogController.openAlert(error.display || Messages.ERROR_SAVING_CUSTOMER);
    return Promise.reject(error);
  }.bind(this));
};

// showTabHistory shows all the sales this customer has charged to their tab.
EditCustomerDialogController.prototype.showTabHistory = function() {
  this.dialogController.await(
      this.getTabHistory(this.customer), 300, Messages.WAIT_FOR_SERVER)
      .catch(function() {
    this.dialogController.openAlert(Messages.ERROR_GETTING_TAB);
    return Promise.reject(Error('tab history'));
  }.bind(this)).then(function(sales) {
    if (!sales || !sales.length) {
      this.dialogController.openAlert(Messages.NO_TAB_HISTORY);
    } else {
      this.dialogController.openTabHistory(this.customer, sales);
    }
  }.bind(this));
};

// open opens the dialog box.
// Returns a promise resolved with choice or rejected if cancelled.
EditCustomerDialogController.prototype.open = function() {
  this.show();
  return new Promise(function(resolve, reject) {
    this.accept = resolve;
    this.cancel = reject;
  }.bind(this));
};

// show shows the dialog box.
EditCustomerDialogController.prototype.show = function() {
  this.view.show();
  this.view.name.focus();
};

// hide hides the dialog box.
EditCustomerDialogController.prototype.hide = function() {
  this.view.hide();
};

EditCustomerDialogController.prototype.up = function() {
  this.focusRing.previous();
};

EditCustomerDialogController.prototype.down = function() {
  this.focusRing.next();
};

EditCustomerDialogController.prototype.tab = function(e) {
  if (e.shiftKey)
    this.focusRing.previous();
  else
    this.focusRing.next();
};

EditCustomerDialogController.prototype.enter = function() {
  this.down();
};
