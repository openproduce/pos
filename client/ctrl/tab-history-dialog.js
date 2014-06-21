// TabHistoryDialogController runs a dialog for inspecting a customer's tab purchases.
function TabHistoryDialogController(args) {
  this.view = args.view;
  this.printTab = args.printTab;
  this.dialogController = args.dialogController;
  this.customer = args.customer;
  this.saleList = new ListController({
    view: args.view.saleList
  });
  this.saleItemList = new ListController({
    view: args.view.saleItemList
  });
  var sales = args.sales;
  if (sales && sales.length) {
    this.saleList.update(sales);
    this.saleItemList.update(sales[0].saleItems);
  } else {
    this.saleList.update([]);
    this.saleItemList.update([]);
  }
}

// esc dismisses the dialog when the user presses escape.
TabHistoryDialogController.prototype.esc = function() {
  return true;
};

// fkey is called when the user presses the nth function key.
TabHistoryDialogController.prototype.fkey = function(n) {
  if (n == 9) {
    this.dialogController.await(this.printTab(this.customer), 300, Messages.WAIT_FOR_SERVER)
        .catch(function(error) {
      this.dialogController.openAlert(error.display || Messages.ERROR_PRINTING);
      return Promise.reject(error);
    }.bind(this));
  }
};

// tab toggles focus between the list and tendered box.
TabHistoryDialogController.prototype.tab = function() {
}

// up scrolls up in the sale item list.
TabHistoryDialogController.prototype.up = function() {
  this.saleItemList.up();
};

// down scrolls up in the sale item list.
TabHistoryDialogController.prototype.down = function() {
  this.saleItemList.down();
};

// left scrolls left in the sale list.
TabHistoryDialogController.prototype.left = function(e) {
  this.saleList.up();
  this.updateSaleItems();
  e.preventDefault();
};

// right scrolls right in the sale list.
TabHistoryDialogController.prototype.right = function(e) {
  this.saleList.down();
  this.updateSaleItems();
  e.preventDefault();
};

// updateSaleItems populates the sale item list with the items from the
// selected sale.
TabHistoryDialogController.prototype.updateSaleItems = function() {
  var sale = this.saleList.getSelection();
  if (sale) {
    this.saleItemList.update(sale.saleItems);
  }
};

// open opens the dialog box.
// Returns a promise resolved with choice or rejected if cancelled.
TabHistoryDialogController.prototype.open = function() {
  this.show();
};

// show shows the dialog box.
TabHistoryDialogController.prototype.show = function() {
  this.view.show();
  this.saleList.focus();
  this.saleItemList.focus();
};

// hide hides the dialog box.
TabHistoryDialogController.prototype.hide = function() {
  this.saleList.blur();
  this.saleItemList.blur();
  this.view.hide();
};
