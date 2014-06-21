// PickerView shows a searchable list of items in the store inventory.
function PickerView(args) {
  this.clerk = new TextView(args.clerk);
  this.time = new TextView(args.time);
  this.date = new TextView(args.date);
  this.price = new TextView(args.price);
  this.unit = new TextView(args.unit);
  this.quantity = args.quantity;
  this.searchField = args.searchField;
  this.items = new ListView({
    dom: args.list,
    template: new PickerItemTemplate()
  });
}

// reset restores the view to its default state, but not the search field.
PickerView.prototype.reset = function() {
  this.quantity.value = '';
  this.price.set('');
  this.unit.set('');
};

// setClerk sets the current clerk's name.
PickerView.prototype.setClerk = function(clerk) {
  this.clerk.set(clerk.name);
};

// updatePick shows a new selected item.
PickerView.prototype.updatePick = function(item, qty) {
  this.price.set(item.costPerQty);
  this.unit.set(item.saleUnit);
  this.quantity.value = qty;
};

// updateClock updates the time shown on the clock.
PickerView.prototype.updateClock = function(date) {
  this.time.set(date.toTimeString().split(' ')[0]);
  this.date.set(date.toDateString());
};
