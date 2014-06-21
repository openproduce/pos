// ListView renders and manages a list of child templates.
function ListView(args) {
  this.dom = args.dom;
  this.template = args.template;
  this.horizontal = !!args.horizontal;
}

// set populates the list with html rendered from the passed in child models.
ListView.prototype.set = function(models) {
  var html = '';
  models.forEach(function(model) {
    html += this.template.fill(model)
  }, this);
  this.dom.innerHTML = html;
};

// add appends html from a single child model to the list.
ListView.prototype.add = function(model) {
  var div = document.createElement('div');
  div.innerHTML = this.template.fill(model);
  this.dom.appendChild(div.firstChild);
};

// replace replaces html for the nth child model.
ListView.prototype.replace = function(n, model) {
  var div = document.createElement('div');
  div.innerHTML = this.template.fill(model);
  var oldChild = this.dom.children[n];
  this.dom.replaceChild(div.firstChild, oldChild);
};

// remove removes the nth child.
ListView.prototype.remove = function(n) {
  var child = this.dom.children[n];
  if (child) {
    this.dom.removeChild(child);
  }
};

// select updates the selection state of the nth child.
ListView.prototype.select = function(n, state) {
  var child = this.dom.children[n];
  if (child) {
    child.classList.toggle('selected', state);
  }
};

// scroll scrolls the list so the nth child is in view.
ListView.prototype.scroll = function(n) {
  var child = this.dom.children[n];
  if (!child) return;
  var pan = function(scroll, start, size) {
    var listSize = this.dom[size];
    var childSize = child[size];
    var childStart = child[start] - this.dom[start];
    if (childStart < this.dom[scroll])
      this.dom[scroll] = childStart - 10;
    else if (childStart + childSize > this.dom[scroll] + listSize)
      this.dom[scroll] = childStart + childSize - listSize + 10;
  }.bind(this);
  if (this.horizontal)
    pan('scrollLeft', 'offsetLeft', 'offsetWidth');
  else
    pan('scrollTop', 'offsetTop', 'offsetHeight');
};
