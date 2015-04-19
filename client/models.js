// Model objects filter JSON to check that expected fields are present with
// correct value types. Unknown fields are silently dropped for forward
// compatibility.
function Model(json, spec) {
  for (var prop in spec) {
    assert(prop in json, 'missing property ' + prop);
    var checkType = spec[prop];
    this[prop] = checkType(json[prop]);
  }
}

// An Item is something the store sells.
function Item(json) {
  Model.call(this, json, {
    'id': $string,
    'desc': $string,
    'costPerQty': $decimal,
    'saleUnit': $string,
    'discontinued': $boolean,
    'plu': $string,
    'barcodes': $array($string),
    'updatedAt': $int
  });
}
Item.prototype = Object.create(Model.prototype);

// Tab payments are magical items that attach a customer to a sale.
Item.prototype.isTabPayment = function() {
  return this.desc == 'tab payment';
};

// Discounts are negative.
Item.prototype.isDiscount = function() {
  return this.desc == 'discount';
};

// hasBarcode returns true if barcode is a barcode for this item.
Item.prototype.hasBarcode = function(barcode) {
  for (var i = 0; i < this.barcodes.length; i++) {
    if (this.barcodes[i] == barcode)
      return true;
  }
  return false;
};

// soldInWholeNumbers returns true if this item is sold in whole number units.
Item.prototype.soldInWholeNumbers = function() {
  return this.saleUnit == 'ea' && !this.isTabPayment() && !this.isDiscount();
};

// A Clerk is a person who sells stuff.
function Clerk(json) {
  Model.call(this, json, {
    'id': $nullable($string),
    'name': $string
  });
}
Clerk.prototype = Object.create(Model.prototype);

// A Customer is a person who buys stuff.
function Customer(json) {
  Model.call(this, json, {
    'id': $nullable($string),
    'name': $string,
    'phone': $string,
    'email': $string,
    'postal': $string,
    'balance': $decimal,
    'limit': $decimal
  });
}
Customer.prototype = Object.create(Model.prototype);

// A Sale is a transaction where someone gives the store money for stuff.
function Sale(json) {
  Model.call(this, json, {
    'id': $nullable($string),
    'clerkId': $nullable($string),
    'customerId': $nullable($string),
    'saleItems': $array($model(SaleItem)),
    'total': $decimal,
    'preTaxTotal': $decimal,
    'isVoid': $boolean,
    'isPaid': $boolean,
    'startTime': $int,
    'endTime': $nullable($int)
  });
}
Sale.prototype = Object.create(Model.prototype);

// A SaleItem is a line item in a sale.
function SaleItem(json) {
  Model.call(this, json, {
    'id': $nullable($string),
    'item': $model(Item),
    'qty': $decimal,
    'subtotal': $decimal
  });
}
SaleItem.prototype = Object.create(Model.prototype);

// CreditCard is the payment info from a credit card.
function CreditCard(json) {
  Model.call(this, json, {
    'cardNumber': $string,
    'customerName': $nullable($string),
    'expYear': $string,
    'expMonth': $string
  });
}
CreditCard.prototype = Object.create(Model.prototype);

// LinkInfo is the payment info for a link transaction.
function LinkInfo(json) {
  Model.call(this, json, {
    'approvalCode': $string
  });
}
LinkInfo.prototype = Object.create(Model.prototype);

// A Payment is a request to pay for a sale.
function Payment(json) {
  Model.call(this, json, {
    'saleId': $string,
    'method': $string,
    'customerId': $nullable($string),
    'creditCard': $nullable($model(CreditCard)),
    'linkInfo': $nullable($model(LinkInfo)),
    'withReceipt': $boolean
  });
}
Payment.prototype = Object.create(Model.prototype);

function parseModelArray(ctor, values) {
  assert(Array.isArray(values), 'expecting array of models');
  return values.map(function(fields) {
    return new ctor(fields);
  });
}

// Type checkers start with '$' because some of the obvious names for types are
// reserved words in Javascript, just in case someone wants to adds a type
// system some day I guess.

// $string checks that value is a string and returns it.
function $string(value) {
  assert(typeof value === 'string', 'expecting string');
  return value;
}

// $decimal checks that value is a Big or string and returns a Big.
function $decimal(value) {
  assert(value instanceof Big || typeof value === 'string', 'expecting decimal');
  return Big(value);
}

// $int checks that value is an integer and returns it.
function $int(value) {
  assert(typeof value === 'number' && ((value % 1) == 0), 'expecting int');
  return value;
}

// $boolean checks that value is a boolean and returns it.
function $boolean(value) {
  assert(typeof value === 'boolean', 'expecting boolean');
  return value;
}

// $nullable modifies a type check to allow null values.
function $nullable(type) {
  return function(value) {
    if (value === null)
      return null;
    return type(value);
  };
}

// $array returns a function which checks and returns an array of types.
// The empty array is always allowed.
function $array(type) {
  return function(values) {
    assert(Array.isArray(values), 'expecting array');
    return values.map(function(each) {
      return type(each);
    });
  };
}

// $model returns a function which checks and returns a model instance.
function $model(klass) {
  return function(value) {
    if (value instanceof klass)
      return value;
    return new klass(value);
  };
}
