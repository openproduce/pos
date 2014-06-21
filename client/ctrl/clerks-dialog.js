// ClerksDialogController shows a searchable list of store clerks.
// It is just a stock ListDialogController.
function ClerksDialogController(args) {
  ListDialogController.call(this, args);
}
ClerksDialogController.prototype = Object.create(ListDialogController.prototype);
