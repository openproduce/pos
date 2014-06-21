// SaleView shows the items in a sale and the total due.
function SaleView(args) {
  this.items = new ListView({
    dom: args.list,
    template: new SaleItemTemplate()
  });
  this.customer = args.customer;
  this.customerName = new TextView(args.customerName);
  this.total = new TextView(args.total);
}

// setTotal displays a decimal number total in the total field.
SaleView.prototype.setTotal = function(total) {
  if (total != 0)
    this.total.set(money(total.toFixed(2)));
  else
    this.total.set('');
};

// setCustomerName shows the customer name if set, otherwise hides the strip of
// UI where the name is shown.
SaleView.prototype.setCustomerName = function(name) {
  if (name) {
    this.customer.classList.remove('hidden');
    this.customerName.set(name);
  } else {
    this.customer.classList.add('hidden');
    this.customerName.set('');
  }
};
