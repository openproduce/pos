// SaleController tracks changes to the current sale, updating display and
// server state as items are added or removed. Server state may be behind
// display state because of latency or errors.
function SaleController(args) {
  this.view = args.view;
  this.itemList = new ListController({
    view: this.view.items
  });
  this.net = args.netController;

  // sale is a promise for the server state of the current sale after all
  // pending network requests.
  this.sale = null;
  // version increments whenever the sale changes.
  this.version = 0;
  this.customer = null;
  this.clerkId = null;
}

// hasItems returns whether the item list view has items.
SaleController.prototype.hasItems = function() {
  return this.itemList.data.length != 0;
};

// clear removes all the items from the current sale.
SaleController.prototype.clear = function() {
  this.sale = null;
  this.customer = null;
  this.view.setCustomerName('');
  this.view.setTotal('');
  this.itemList.update([]);
  // Note this doesn't clear the clerk field so it is sticky between sales.
};

// setClerk sets the clerk for this sale. If clerk is null then instead the
// clerk field is cleared.
SaleController.prototype.setClerk = function(clerk) {
  this.version++;
  this.clerkId = clerk ? clerk.id : null;
  this.changeServerState(function(state) {
    return this.net.setSaleClerk(state.sale, clerk);
  }.bind(this));
};

// setCustomer sets the customer associated with the current sale. It's called
// when the clerk opens the customers dialog or adds a tab payment. If customer
// is null then instead this method clears the customer field.
//
// Choosing the payment type "tab" doesn't call this since sales shouldn't
// change once payment starts.
SaleController.prototype.setCustomer = function(customer) {
  this.version++;
  this.customer = customer;
  this.view.setCustomerName(customer ? customer.name : '');
  this.changeServerState(function(state) {
    return this.net.setSaleCustomer(state.sale, customer);
  }.bind(this));
};

// addItem adds an amount qty of an inventory item to the current sale.
// It updates views, tells the server, and then adjusts views if necessary
// after the server responds.
SaleController.prototype.addItem = function(item, qty, costPerQty) {
  this.version++;
  var subtotal = qty.times(costPerQty).toFixed(2);
  var saleItem = new SaleItem({
    id: null,
    itemId: item.id,
    desc: item.desc,
    costPerQty: costPerQty,
    saleUnit: item.saleUnit,
    qty: qty,
    subtotal: subtotal
  });
  this.itemList.add(saleItem);
  this.view.setTotal(this.guessTotal());
  this.changeServerState(function(state) {
    return this.net.addItemToSale(state.sale, saleItem);
  }.bind(this));
};

// deleteSelectedItem removes the selected item from the current sale.
// It updates views, tells the server, and then adjusts the views as necessary
// after the server responds.
SaleController.prototype.deleteSelectedItem = function() {
  this.version++;
  var index = this.itemList.choice;
  this.itemList.deleteSelected();
  this.view.setTotal(this.guessTotal());
  this.changeServerState(function(state) {
    return this.net.removeItemFromSale(state.sale, state.sale.saleItems[index]);
  }.bind(this));

  // Removing the last item deletes the current sale. Let the current network
  // actions finish, but apply future changes to a new sale.
  if (!this.hasItems()) {
    this.version++;
    this.sale = null;
    this.customer = null;
  }
};

// changeServerState applies a change to the current server state, or creates a
// server state if one doesn't exist.
SaleController.prototype.changeServerState = function(change) {
  if (!this.sale) {
    // Recreate the state if it was blown away by abort.
    // This also prevents creating an empty sale when just setting a customer
    // with no items added yet.
    if (this.hasItems())
      this.createSale();
  } else {
    this.updateSale(change);
  }
};

// getSale returns the server state of the current sale, forcing it to be
// committed if it isn't.
SaleController.prototype.getSale = function() {
  if (this.sale)
    return this.sale;
  if (this.hasItems())
    return this.createSale();
  return null;
};

// createSale creates a new server sale state from the current display state.
SaleController.prototype.createSale = function() {
  var saleItems = this.itemList.data.slice();
  var sale = new Sale({
    id: null,
    clerkId: this.clerkId,
    startTime: ~~(new Date().getTime() / 1000),
    endTime: null,
    saleItems: saleItems,
    preTaxTotal: Big(0),
    total: this.guessTotal(saleItems),
    customerId: this.customer ? this.customer.id : null,
    isVoid: false,
    isPaid: false
  });
  this.sale = this.net.createSale(sale)
      .catch(this.invalidateServerState.bind(this))
      .then(this.stamp.bind(this, this.version))
      .then(this.syncViews.bind(this));
  return this.sale;
};

// updateSale adds a change to the server sale state.
SaleController.prototype.updateSale = function(change) {
  assert(this.sale, 'updateSale expects a sale to exist');
  this.sale = this.sale.then(change)
      .catch(this.invalidateServerState.bind(this))
      .then(this.stamp.bind(this, this.version))
      .then(this.syncViews.bind(this));
};

// stamp creates a versioned state given a sale and a version.
SaleController.prototype.stamp = function(version, sale) {
  return {version: version, sale: sale};
};

// invalidateServerState invalidates the server sale state after a network or
// protocol error. On the next action, we'll try to recreate it.
SaleController.prototype.invalidateServerState = function(err) {
  logError(err);
  this.sale = null;
  return Promise.reject(Error('Invalid server state'));
};

// syncViews applies the server sale state to the views.
SaleController.prototype.syncViews = function(state) {
  assert(state.version <= this.version, 'Server ahead of display version.');
  if (state.version == this.version) {
    this.itemList.update(state.sale.saleItems, this.itemList.choice);
    this.view.setTotal(state.sale.total);
    // Don't attempt to update the customer field. This probably will never
    // change in a server response, and if it did, would be more confusing than
    // it is worth.
  }
  return state;
};

// guessTotal adds up subtotals to display a total estimate.
SaleController.prototype.guessTotal = function() {
  return this.itemList.data.reduce(function(total, item) {
    return total.plus(Big(item.subtotal));
  }, Big(0));
};

// up moves the cursor up in the item list.
SaleController.prototype.up = function() {
  this.itemList.up();
};

// down moves the cursor down in the item list.
SaleController.prototype.down = function() {
  this.itemList.down();
};

// focus draws a highlight in the item list.
SaleController.prototype.focus = function() {
  this.itemList.focus();
};

// blur clears the highlight in the item list.
SaleController.prototype.blur = function() {
  this.itemList.blur();
};
