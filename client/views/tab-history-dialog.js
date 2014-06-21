// TabHistoryDialogView shows a dialog for reviewing a customer's tab purchases.
function TabHistoryDialogView(args) {
  DialogView.call(this, args);
  this.saleList = new ListView({
    dom: args.saleList,
    template: new TabSaleChoiceTemplate(),
    horizontal: true
  });
  this.saleItemList = new ListView({
    dom: args.saleItemList,
    template: new TabSaleItemTemplate(),
  });
}
TabHistoryDialogView.prototype = Object.create(DialogView.prototype);
