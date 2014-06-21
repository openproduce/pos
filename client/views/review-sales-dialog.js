// ReviewSalesDialogView shows a dialog for reviewing past sales.
// Unlike a normal list dialog, there is no search field.
function ReviewSalesDialogView(args) {
  DialogView.call(this, args);
  this.list = new ListView({
    dom: args.list,
    template: new ReviewSalesChoiceTemplate()
  });
}
ReviewSalesDialogView.prototype = Object.create(DialogView.prototype);
