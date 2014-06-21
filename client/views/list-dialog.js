// ListDialogView shows a dialog with an incrementally searchable list of items.
function ListDialogView(args) {
  DialogView.call(this, args);
  this.searchField = args.searchField;
  this.list = new ListView({
    dom: args.list,
    template: args.template
  });
}
ListDialogView.prototype = Object.create(DialogView.prototype);
