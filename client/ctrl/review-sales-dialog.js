// ReviewSalesDialogController runs a dialog box to review and void/unvoid past sales.
function ReviewSalesDialogController(args) {
  this.view = args.view;
  this.dialogController = args.dialogController;
  this.voidSale = args.voidSale;
  this.unvoidSale = args.unvoidSale;
  this.printReceipt = args.printReceipt;
  this.saleList = new ListController({view: args.view.list});
  this.saleList.update(args.sales);
}

// esc dismisses the dialog when the user presses escape.
ReviewSalesDialogController.prototype.esc = function() {
  return true;
};

// fkey is called when the user presses the nth function key.
ReviewSalesDialogController.prototype.fkey = function(n) {
  var index = this.saleList.choice;
  var sale = this.saleList.getSelection();
  if (sale) {
    if (n == 6) {
      var flipVoid = sale.isVoid ? this.unvoidSale : this.voidSale;
      this.dialogController.await(
          flipVoid(sale), 300, Messages.WAIT_FOR_SERVER).catch(function(error) {
        this.dialogController.openAlert(error.display || Messages.ERROR_VOIDING);
        return Promise.reject(error);
      }.bind(this)).then(function(sale) {
        this.saleList.replace(index, sale);
      }.bind(this));
    } else if (n == 7) {
      this.dialogController.await(
          this.printReceipt(sale), 300, Messages.WAIT_FOR_SERVER).catch(function(error) {
        this.dialogController.openAlert(error.display || Messages.ERROR_PRINTING);
        return Promise.reject(error);
      }.bind(this));
    }
  }
};

// up scrolls up in the list.
ReviewSalesDialogController.prototype.up = function() {
  this.saleList.up();
};

// down scrolls up in the list.
ReviewSalesDialogController.prototype.down = function() {
  this.saleList.down();
};

// open opens the dialog box.
// Returns a promise resolved with choice or rejected if cancelled.
ReviewSalesDialogController.prototype.open = function() {
  this.show();
};

// show shows the dialog box.
ReviewSalesDialogController.prototype.show = function() {
  this.saleList.focus();
  this.view.show();
};

// hide hides the dialog box.
ReviewSalesDialogController.prototype.hide = function() {
  this.saleList.blur();
  this.view.hide();
};

// daysAgo gets a date n days ago.
ReviewSalesDialogController.daysAgo = function(n) {
  var date = new Date();
  date.setDate(date.getDate() - 3);
  return ~~(date.getTime() / 1000);
};
