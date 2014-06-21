// EditCustomerDialogView shows and collects edits to one customer's contact info.
function EditCustomerDialogView(args) {
  DialogView.call(this, args);
  this.name = args.name;
  this.email = args.email;
  this.phone = args.phone;
  this.postal1 = args.postal1;
  this.postal2 = args.postal2;
  this.postal3 = args.postal3;
  this.limit = args.limit;
  this.balance = new TextView(args.balance);
}
EditCustomerDialogView.prototype = Object.create(DialogView.prototype);

// setCustomer populates controls with data from the customer object.
EditCustomerDialogView.prototype.setCustomer = function(customer) {
  this.name.value = customer.name || '';
  this.email.value = customer.email || '';
  this.phone.value = customer.phone || '';
  if (customer.postal) {
    var lines = customer.postal.split('\n');
    this.postal1.value = lines[0];
    this.postal2.value = lines[1] || '';
    this.postal3.value = lines[2] || '';
  } else {
    this.postal1.value = ''
    this.postal2.value = ''
    this.postal3.value = ''
  }
  this.limit.value = customer.limit || '0';
  this.balance.set(money(customer.balance || 0));
};

// getEdits returns the edit state of the UI controls for customer info.
EditCustomerDialogView.prototype.getEdits = function() {
  var lines = [this.postal1.value,
      this.postal2.value,
      this.postal3.value].filter(function(line) {
    return line != '';
  });
  return {name: this.name.value,
          email: this.email.value,
          phone: this.phone.value,
          postal: lines.join('\n'),
          limit: this.limit.value};
};
