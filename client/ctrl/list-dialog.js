// ListDialogController shows a searchable list of items.
// It expects a view with a list and searchField child, and a search method.
function ListDialogController(args) {
  this.view = args.view;
  this.requireText = args.requireText;
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
  this.clear();
  this.cancel();
  return true;
};

// enter accepts the current choice if any when the user presses enter.
ListDialogController.prototype.enter = function() {
  if (this.requireText && this.searchController.hasEmptySearch()) {
    // To prevent selection errors require some text to be entered first.
    this.dialogController.openAlert(Messages.ERROR_NEED_TEXT);
    return false;
  }
  var choice = this.listController.getSelection();
  this.clear();
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
  var search = this.searchController.search('');
  var dialogPromise = new Promise(function(resolve, reject) {
    this.accept = resolve;
    this.cancel = reject;
  }.bind(this));
  this.dialogController.await(search, 300, Messages.WAIT_FOR_SERVER)
      .then(function() { this.show(); }.bind(this))
      .catch(function(error) {
    var close = function() { this.dialogController.close(); }.bind(this);
    this.dialogController.openAlert(error.display || Messages.ERROR_LIST)
      .then(close, close);
    return Promise.reject(error);
  }.bind(this));
  return dialogPromise;
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

// clear clears the search field value.
ListDialogController.prototype.clear = function() {
  this.view.searchField.value = '';
};
