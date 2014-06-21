// CustomersDialogController shows a list of customers.
// It inherits most functionality from ListDialogController.
function CustomersDialogController(args) {
  ListDialogController.call(this, args);
  this.dialogController = args.dialogController;
}
CustomersDialogController.prototype = Object.create(ListDialogController.prototype);

// fkey() is called when the user presses the nth function key.
CustomersDialogController.prototype.fkey = function(n) {
  if (n == 6) {
    // Add customer
    this.openEditDialog();
  } else if (n == 7) {
    // Edit customer
    var customer = this.listController.getSelection();
    this.openEditDialog(customer);
  }
};

CustomersDialogController.prototype.openEditDialog = function(customer) {
  this.blur();
  this.dialogController.openEditCustomerDialog(customer)
      .then(this.searchController.repeat.bind(this.searchController));
  this.focus();
};

CustomersDialogController.prototype.blur = function() {
};

CustomersDialogController.prototype.focus = function() {
  this.view.searchField.focus();
};
