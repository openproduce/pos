// ListController tracks the highlightion in a list view and updates its items.
function ListController(args) {
  this.view = args.view;
  this.data = [];
  this.choice = 0;
  this.focused = false;
}

ListController.prototype.getSelection = function() {
  return this.data[this.choice];
};

ListController.prototype.down = function() {
  if (this.choice < this.data.length - 1) {
    this.highlight(false);
    this.choice++;
    this.highlight(true);
    return true;
  }
  return false;
};

ListController.prototype.up = function() {
  if (this.choice > 0) {
    this.highlight(false);
    this.choice--;
    this.highlight(true);
    return true;
  }
  return false;
};

ListController.prototype.choose = function(n) {
  this.highlight(false);
  this.choice = n;
  this.highlight(true);
};

ListController.prototype.focus = function() {
  this.focused = true;
  this.highlight(true);
};

ListController.prototype.blur = function() {
  this.highlight(false);
  this.focused = false;
};

// update replaces all the data in the list and selects a new choice.
ListController.prototype.update = function(data, newChoice) {
  this.highlight(false);
  this.data = data.slice();
  this.view.set(data);
  this.choice = newChoice || 0;
  if (this.choice < 0)
    this.choice = 0;
  if (this.choice > this.data.length)
    this.choice = this.data.length - 1;
  this.highlight(true);
};

ListController.prototype.replace = function(n, item) {
  this.data[n] = item;
  this.view.replace(n, item);
  this.highlight(false);
  this.highlight(true);
};

ListController.prototype.add = function(item) {
  this.data.push(item);
  this.highlight(false);
  this.view.add(item);
  this.choice = this.data.length - 1;
  this.highlight(true);
};

ListController.prototype.deleteSelected = function() {
  this.view.remove(this.choice);
  this.data.splice(this.choice, 1);
  if (!this.up())
    this.highlight(true);
};

ListController.prototype.highlight = function(state) {
  if (this.focused) {
    this.view.select(this.choice, state);
  }
  if (state)
    this.view.scroll(this.choice);
};
