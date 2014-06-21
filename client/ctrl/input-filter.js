// InputFilter captures input for text fields like price and quantity which
// expect non-negative decimal numbers, and prevents bad input.
function InputFilter(args) {
  this.dom = args.dom;
  this.allowNumbers = args.allowNumbers;
  this.allowDot = args.allowDot;
  this.keydownListener = this.keydown.bind(this);
}

InputFilter.prototype.bind = function() {
  this.dom.addEventListener('keydown', this.keydownListener);
};

InputFilter.prototype.unbind = function() {
  this.dom.removeEventListener('keydown', this.keydownListener);
};

InputFilter.prototype.keydown = function(e) {
  var key = decodeKey(e);
  if (!this.isLegalKey(key)) {
    e.preventDefault();
    return false;
  }
};

InputFilter.prototype.isLegalKey = function(key) {
  return !key.ascii ||
      this.allowDot && key.ascii == '.' ||
      this.allowNumbers && /[0-9]/.test(key.ascii);
};
