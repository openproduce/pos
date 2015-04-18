// SearchFieldController fetches and updates results as the user types in a
// text field. The actual searching is delegated to a function search(query),
// which returns a promise for a list of models matching query.
function SearchFieldController(args) {
  this.inputField = args.inputField;
  this.doSearch = args.search;
  this.resultController = args.resultController;

  this.lastQuery = null;
  this.keydownListener = this.keydown.bind(this);
}

SearchFieldController.prototype.bind = function() {
  this.inputField.addEventListener('keydown', this.keydownListener);
};

SearchFieldController.prototype.unbind = function() {
  this.inputField.removeEventListener('keydown', this.keydownListener);
};

SearchFieldController.prototype.hasEmptySearch = function() {
  return !this.inputField.value;
};

// keydown triggers a new search.
SearchFieldController.prototype.keydown = function() {
  setTimeout(this.search.bind(this), 0);
};

// search fetches results and updates the results list.
SearchFieldController.prototype.search = function() {
  var query = this.inputField.value;
  if (query == this.lastQuery)
    return;
  this.lastQuery = query;

  return this.doSearch(query)
             .then(this.resultController.update.bind(this.resultController));
};

// repeat does another search for the current query, if any.
SearchFieldController.prototype.repeat = function() {
  var query = this.lastQuery;
  if (query != null) {
    this.lastQuery = null;
    this.search();
  }
};
