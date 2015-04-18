// PickerController controls finding and adding a single item to a sale.
function PickerController(args) {
  this.view = args.view;
  this.saleController = args.saleController;
  this.itemListController = new ListController({view: this.view.items});
  this.searchController = new SearchFieldController({
    inputField: this.view.searchField,
    search: args.netController.searchItems.bind(args.netController),
    resultController: this
  });
  this.searchController.bind();
  new InputFilter({
    dom: this.view.quantity,
    allowNumbers: true,
    allowDot: true
  }).bind();
  this.pickCustomer = args.pickCustomer;

  this.itemListController.focus();
  this.lastActiveElement = null;
  this.updateClock();
  setInterval(this.updateClock.bind(this), 500);
}

// setClerk sets the current clerk. clerk may be null to unset the clerk.
PickerController.prototype.setClerk = function(clerk) {
  this.view.setClerk(clerk);
};

// updateClock draws the current date and time.
PickerController.prototype.updateClock = function() {
  this.view.updateClock(new Date());
};

// reset resets the picker's state to an empty search query and focuses the
// search field.
PickerController.prototype.reset = function() {
  this.view.reset();
  this.view.searchField.value = '';
  this.view.searchField.focus();
  this.searchController.search();
};

// update receives incremental search results as the user is typing.
PickerController.prototype.update = function(results) {
  this.itemListController.update(results);
  // The top item is always chosen.
  this.updatePick();
}

// updatePick refreshes quantity and price for the chosen item.
PickerController.prototype.updatePick = function() {
  var pick = this.itemListController.getSelection();
  if (!pick) {
    this.view.reset();
    return;
  }
  this.view.updatePick(pick, '');
};

// tab cycles system focus between the quantity field and search field when
// tab is pressed.
PickerController.prototype.tab = function() {
  var focused = document.activeElement;
  var pick = this.itemListController.getSelection();
  if (focused == this.view.searchField && pick) {
    this.view.quantity.focus();
    this.view.quantity.select();
  } else if (focused == this.view.quantity) {
    this.view.searchField.focus();
  }
};

// enter is called when the user presses enter in any picker text field. It
// performs basic input validation, adds the chosen item to the sale, and then
// resets the picker form's state.
PickerController.prototype.enter = function() {
  var pick = this.itemListController.getSelection();
  if (!pick) {
    this.view.reset();
    return;
  }
  if (pick.isTabPayment() && !this.saleController.customer) {
    this.pickCustomer().then(function() {
      var customer = this.saleController.customer;
      if (!customer) return;
      if (customer.balance.gt(0)) {
        this.view.quantity.value = customer.balance.toFixed(2);
        this.view.quantity.focus();
      } else {
        this.view.quantity.focus();
      }
    }.bind(this));
  } else {
    this.addItem(pick);
  }
};

// addItem adds an item, pick, to the current sale.
PickerController.prototype.addItem = function(pick) {
  // simpleScan is true when the clerk just scans a barcode without first
  // pressing space.
  var simpleScan = pick.hasBarcode(this.view.searchField.value);
  if (this.view.quantity.value == '') {
    if (simpleScan || pick.soldInWholeNumbers()) {
      // Simple scans and non-special items sold by the each default to 1.
      this.view.quantity.value = '1';
    }
    if (!simpleScan) {
      // Require the clerk to explicitly vet or edit the quantity when it is
      // set by default, except for simple barcode scans.
      this.view.quantity.select();
      this.view.quantity.focus();
      return;
    }
  }
  try {
    var qty = Big(this.view.quantity.value).round(6);
    var isNegativeOrZero = qty.lte(Big('0'));
    var hasFractionalPart = !qty.eq(qty.round());
    if (isNegativeOrZero || pick.soldInWholeNumbers() && hasFractionalPart) {
      throw new Error("Invalid quantity.");
    }
  } catch (e) {
    this.view.quantity.focus();
    this.view.quantity.select();
    return;
  }
  this.saleController.addItem(pick, qty);
  this.reset();
};

// esc resets the state of the search form.
PickerController.prototype.esc = function() {
  this.reset();
};

// atEndOfText returns true if the cursor is at the end of a picker text
// field with no selection. It is checked to see if pressing right should give
// focus to the sale list.
PickerController.prototype.atEndOfText = function() {
  var focused = document.activeElement;
  return (focused == this.view.searchField || focused == this.view.quantity) &&
      (focused.selectionStart == focused.selectionEnd &&
       focused.selectionStart == focused.value.length);
};

// blur removes system focus and hides list selection in the picker.
PickerController.prototype.blur = function() {
  var focused = document.activeElement;
  if (focused == this.view.searchField || focused == this.view.quantity) {
    focused.blur();
    this.lastActiveElement = focused;
  }
  this.itemListController.blur();
};

// focus restores system focus and shows selections again.
PickerController.prototype.focus = function() {
  if (this.lastActiveElement) {
    this.lastActiveElement.focus();
    this.lastActiveElement = null;
  } else {
    this.view.searchField.focus();
  }
  this.itemListController.focus();
};

// Returns true if quantity field is focused.
PickerController.prototype.isQuantityFocused = function() {
  return document.activeElement == this.view.quantity;
};

// up is called when the user presses up. It moves focus up inside the
// results list, or moves up to the input field above the current one.
PickerController.prototype.up = function() {
  var movedSelection = false;
  if (document.activeElement == this.view.searchField) {
    movedSelection = this.itemListController.up();
    if (movedSelection)
      this.updatePick();
  }
  if (!movedSelection) {
    if (document.activeElement == this.view.searchField &&
        this.itemListController.getSelection()) {
      this.view.quantity.focus();
      this.view.quantity.select();
    }
  }
};

// down is called when the user presses down. It moves focus down inside the
// results list, or moves down to the input field below the current one.
PickerController.prototype.down = function() {
  if (document.activeElement == this.view.searchField) {
    this.itemListController.down();
    this.updatePick();
  } else if (document.activeElement == this.view.quantity) {
    this.view.searchField.focus();
  }
};
