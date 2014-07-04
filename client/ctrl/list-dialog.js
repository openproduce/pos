// ListDialogController shows a searchable list of items.
// It expects a view with a list and searchField child, and a search method.
function ListDialogController(args) {
  this.view = args.view;
  this.dialogController = args.dialogController;
  this.listController = new ListController({view: args.view.list});
  this.searchController = new SearchFieldController({
    inputField: this.view.searchField,
    search: args.search,
    resultController: this.listController
  });
  this.accept = null;
  this.cancel = null;
}

// esc dismisses the dialog when the user presses escape.
ListDialogController.prototype.esc = function() {
  this.cancel();
  return true;
};

// enter accepts the current choice if any when the user presses enter.
ListDialogController.prototype.enter = function() {
  var choice = this.listController.getSelection();
  if (choice)
    this.accept(choice);
  else
    this.cancel();
  return true;
};

// up scrolls up in the list.
ListDialogController.prototype.up = function() {
  this.listController.up();
};

// down scrolls up in the list.
ListDialogController.prototype.down = function() {
  this.listController.down();
};

// open opens and shows the dialog box.
// Returns a promise resolved with choice or rejected if cancelled.
ListDialogController.prototype.open = function() {
  this.show();
  var search = this.searchController.search('');
  this.dialogController.await(search, 300, Messages.WAIT_FOR_SERVER)
      .catch(function(error) {
    this.dialogController.openAlert(error.display || Messages.ERROR_LIST);
    return Promise.reject(error);
  }.bind(this));
  return new Promise(function(resolve, reject) {
    this.accept = resolve;
    this.cancel = reject;
  }.bind(this));
};

// show shows the dialog box.
ListDialogController.prototype.show = function() {
  this.view.show();
  this.searchController.bind();
  this.view.searchField.focus();
  this.listController.focus();
};

// hide hides the dialog box.
ListDialogController.prototype.hide = function() {
  this.searchController.unbind();
  this.view.searchField.blur();
  this.listController.blur();
  this.view.hide();
};