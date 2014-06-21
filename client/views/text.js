// TextView renders and updates a single text value somewhere in the dom.
function TextView(dom) {
  this.dom = dom;
}

// set updates the text displayed.
TextView.prototype.set = function(text) {
  this.dom.textContent = text;
};
