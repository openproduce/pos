// ChangeMaker displays the change due for an amount tendered, updating a text
// view as the clerk types in the tendered input field.
function ChangeMaker(args) {
  this.total = args.total;
  this.tendered = args.tendered;
  this.due = args.due;
  this.filter = new InputFilter({
    dom: this.tendered,
    allowNumbers: true,
    allowDot: true
  });

  this.keydownListener = this.keydown.bind(this);
};

// bind attaches listeners to the tendered input field.
ChangeMaker.prototype.bind = function() {
  this.filter.bind();
  this.tendered.addEventListener('keydown', this.keydownListener);
};

// unbind removes listeners from the tendered input field.
ChangeMaker.prototype.unbind = function() {
  this.filter.unbind();
  this.tendered.removeEventListener('keydown', this.keydownListener);
};

// keydown signals to update change amount.
ChangeMaker.prototype.keydown = function() {
  setTimeout(this.update.bind(this), 0);
};

// updates the amount of change due.
ChangeMaker.prototype.update = function() {
  try {
    var amount = Big(this.tendered.value);
    if (amount.gte(this.total))
      this.due.set(money(amount.minus(this.total)));
    else
      this.due.set('');
  } catch (e) {
    this.due.set('');
  }
};
