module('models');

test('model base ctor', function() {
  var aCalled = false;
  var a = function(arg) {
    aCalled = true;
    equal(arg, 'a');
    return 'A';
  };
  var bCalled = false;
  var b = function(arg) {
    bCalled = true;
    equal(arg, 'b');
    return 'B';
  }
  var model = new Model({'a': 'a', 'b': 'b', 'c': 'c'}, {'a': a, 'b': b});
  ok(aCalled && bCalled);
  equal(model.a, 'A');
  equal(model.b, 'B');
  ok(!('c' in model));
});

test('item valid', function() {
  var item = new Item({
    'id': 42,
    'desc': 'A colorful tapestry',
    'costPerQty': '4.20',
    'saleUnit': 'truckload',
    'discontinued': false,
    'plu': '2434',
    'barcodes': ['12345678901'],
    'updatedAt': 0,
    'fabulous': 'yes'
  });
  equal(item.id, 42);
  equal(item.desc, 'A colorful tapestry');
  ok(Big('4.20').eq(item.costPerQty));
  equal(item.saleUnit, 'truckload');
  equal(item.discontinued, false);
  equal(item.plu, '2434');
  deepEqual(item.barcodes, ['12345678901']);
  equal(item.updatedAt, 0);
  ok(!('fabulous' in item));
});

test('item missing desc', function() {
  throws(function() {
    var item = new Item({
      'id': 42,
      'costPerQty': '4.20',
      'saleUnit': 'truckload',
      'discontinued': false,
      'plu': '2434',
      'barcodes': ['12345678901'],
      'updatedAt': 0
    });
  }, 'missing property desc');
});

test('clerk valid', function() {
  var clerk = new Clerk({
    'id': 2,
    'name': 'bob',
    'gender': 'male'
  });
  equal(clerk.id, 2);
  equal(clerk.name, 'bob');
  ok(!('gender' in clerk));
});

test('clerk with bad id', function() {
  throws(function() {
    var clerk = new Clerk({
      'id': 'bob',
      'name': 'bob'
    });
  }, 'expecting int');
});

test('customer valid', function() {
  var customer = new Customer({
    'id': null,
    'name': 'pedro',
    'phone': '555-1212',
    'email': '',
    'postal': '',
    'balance': '3.14',
    'limit': '0',
    'sombrero': 'awesome'
  });
  equal(customer.id, null);
  equal(customer.name, 'pedro');
  equal(customer.phone, '555-1212');
  equal(customer.email, '');
  equal(customer.postal, '');
  ok(Big('3.14').eq(customer.balance));
  ok(Big('0').eq(customer.limit));
  ok(!('sombrero' in customer));
});

test('customer missing name', function() {
  throws(function() {
    var customer = new Customer({
      'id': null,
      'phone': '555-1212',
      'email': '',
      'postal': '',
      'balance': '3.14',
      'limit': '0'
    });
  }, 'missing property name');
});

test('sale empty valid', function() {
  var sale = new Sale({
    'id': null,
    'clerkId': 2,
    'customerId': null,
    'saleItems': [],
    'total': '0',
    'preTaxTotal': '0',
    'isVoid': false,
    'isPaid': false,
    'startTime': 100,
    'endTime': null,
    'party': 'yeah'
  });
  equal(sale.id, null);
  equal(sale.clerkId, 2);
  equal(sale.customerId, null);
  deepEqual(sale.saleItems, []);
  ok(Big('0').eq(sale.total));
  ok(Big('0').eq(sale.preTaxTotal));
  equal(sale.isVoid, false);
  equal(sale.isPaid, false);
  equal(sale.startTime, 100);
  equal(sale.endTime, null);
  ok(!('party' in sale));
});

test('sale with number total', function() {
  throws(function() {
    var sale = new Sale({
      'id': null,
      'clerkId': 2,
      'customerId': null,
      'saleItems': [],
      'total': 0,
      'preTaxTotal': '0',
      'isVoid': false,
      'isPaid': false,
      'startTime': 100,
      'endTime': null
    });
  }, 'expecting decimal');
});

test('sale item valid', function() {
  var itemFields = {
    'id': 42,
    'desc': 'A colorful tapestry',
    'costPerQty': '4.20',
    'saleUnit': 'truckload',
    'discontinued': false,
    'plu': '2434',
    'barcodes': ['12345678901'],
    'updatedAt': 0,
    'fabulous': 'yes'
  };
  var saleItem = new SaleItem({
    'id': 12,
    'item': itemFields,
    'qty': '2.2',
    'subtotal': '6.26'
  });
  equal(saleItem.id, 12);
  deepEqual(saleItem.item, new Item(itemFields));
  ok(Big('2.2').eq(saleItem.qty));
  ok(Big('6.26').eq(saleItem.subtotal));
});

test('sale item bad item', function() {
  throws(function() {
    var itemFields = {
      'id': 42,
      'costPerQty': '4.20',
      'saleUnit': 'truckload',
      'discontinued': false,
      'plu': '2434',
      'barcodes': ['12345678901'],
      'updatedAt': 0
    };
    new SaleItem({
      'id': 12,
      'item': itemFields,
      'qty': '2.2',
      'subtotal': '6.26'
    });
  }, 'missing property desc');
});

test('sale with item valid', function() {
  var saleItem = new SaleItem({
    'id': 12,
    'item': new Item({
      'id': 42,
      'desc': 'A colorful tapestry',
      'costPerQty': '4.20',
      'saleUnit': 'truckload',
      'discontinued': false,
      'plu': '2434',
      'barcodes': ['12345678901'],
      'updatedAt': 0,
      'fabulous': 'yes'
    }),
    'qty': '2.2',
    'subtotal': '6.26'
  });
  var sale = new Sale({
    'id': null,
    'clerkId': 2,
    'customerId': null,
    'saleItems': [saleItem, saleItem],
    'total': '0',
    'preTaxTotal': '0',
    'isVoid': false,
    'isPaid': false,
    'startTime': 100,
    'endTime': null,
    'party': 'yeah'
  });
  equal(sale.id, null);
  equal(sale.clerkId, 2);
  equal(sale.customerId, null);
  deepEqual(sale.saleItems, [saleItem, saleItem]);
  ok(Big('0').eq(sale.total));
  ok(Big('0').eq(sale.preTaxTotal));
  equal(sale.isVoid, false);
  equal(sale.isPaid, false);
  equal(sale.startTime, 100);
  equal(sale.endTime, null);
  ok(!('party' in sale));
});

test('sale with bad sale item', function() {
  throws(function() {
    new Sale({
      'id': null,
      'clerkId': 2,
      'customerId': null,
      'saleItems': [{
        'id': 12,
        'item': {
          'id': 42,
          'desc': 'A colorful tapestry',
          'costPerQty': '4.20',
          'saleUnit': 'truckload',
          'discontinued': false,
          'plu': '2434',
          'barcodes': ['12345678901'],
          'updatedAt': 0,
        },
        'qty': 2,
        'subtotal': '6.26'
      }],
      'total': '0',
      'preTaxTotal': '0',
      'isVoid': false,
      'isPaid': false,
      'startTime': 100,
      'endTime': null,
    });
  }, 'expecting decimal');
});

test('credit card well-formed', function() {
  var card = new CreditCard({
    'cardNumber': '1',
    'customerName': null,
    'expYear': '01',
    'expMonth': '12',
    'usury': '20.6%'
  });
  equal(card.cardNumber, '1');
  equal(card.customerName, null);
  equal(card.expYear, '01');
  equal(card.expMonth, '12');
  ok(!('usury' in card));
});

test('credit card missing number', function() {
  throws(function() {
    new CreditCard({
      'customerName': null,
      'expYear': '01',
      'expMonth': '12'
    });
  }, 'missing property cardNumber');
});

test('link info valid', function() {
  var linkInfo = new LinkInfo({
    'approvalCode': '123'
  });
  equal(linkInfo.approvalCode, '123');
});

test('link info missing approval code', function() {
  throws(function() {
    new LinkInfo({});
  }, 'missing property approvalCode');
});

test('payment valid', function() {
  var payment = new Payment({
    'saleId': 2,
    'method': 'cash',
    'customerId': null,
    'creditCard': null,
    'linkInfo': null,
    'withReceipt': true,
    'withFries': false,
  });
  equal(payment.saleId, 2);
  equal(payment.method, 'cash');
  equal(payment.customerId, null);
  equal(payment.creditCard, null);
  equal(payment.linkInfo, null);
  equal(payment.withReceipt, true);
  ok(!('withFries' in payment));
});

test('payment missing customerId', function() {
  throws(function() {
    new Payment({
      'saleId': 2,
      'method': 'cash',
      'creditCard': null,
      'linkInfo': null,
      'withReceipt': true
    });
  }, 'missing property customerId');
});

test('parse model array', function() {
  var jay = {'id': 1, 'name': 'jay'};
  var silentBob = {'id': 2, 'name': 'silent bob'};
  var clerks = parseModelArray(Clerk, [jay, silentBob]);
  deepEqual(clerks, [new Clerk(jay), new Clerk(silentBob)]);
});

test('parse model array throws if not array', function() {
  throws(function() {
    parseModelArray(Clerk, '[{id:1,name:"bob"}]');
  }, 'expecting array of models');
});

test('type $string', function() {
  ok($string('foo') === 'foo');
  ok($string('') === '');
  throws(function() { $string(null); }, 'expecting string');
  throws(function() { $string(undefined); }, 'expecting string');
  throws(function() { $string(0); }, 'expecting string');
});

test('type $decimal', function() {
  ok(Big('0').eq($decimal('0')));
  ok(Big('-0.2').eq($decimal('-0.2')));
  ok(Big('42').eq($decimal(Big('42'))));
  throws(function() { $decimal(null); }, 'expecting decimal');
  throws(function() { $decimal(undefined); }, 'expecting decimal');
  throws(function() { $decimal(0); }, 'expecting decimal');
  throws(function() { $decimal('0..2'); }, 'BigError');
});

test('type $int', function() {
  ok($int(0) === 0);
  ok($int(10) === 10);
  ok($int(-2) === -2);
  throws(function() { $int('0'); }, 'expecting int');
  throws(function() { $int(null); }, 'expecting int');
  throws(function() { $int(undefined); }, 'expecting int');
  throws(function() { $int(1.1); }, 'expecting int');
  throws(function() { $int(NaN); }, 'expecting int');
});

test('type $boolean', function() {
  ok($boolean(true) === true);
  ok($boolean(false) === false);
  throws(function() { $boolean(''); }, 'expecting boolean');
  throws(function() { $boolean('0'); }, 'expecting boolean');
  throws(function() { $boolean('1'); }, 'expecting boolean');
  throws(function() { $boolean(null); }, 'expecting boolean');
  throws(function() { $boolean(undefined); }, 'expecting boolean');
});

test('type $nullable', function() {
  var nullFoo = $nullable(function(x) {
    if (x === 'foo')
      return x;
    throw 'error';
  });
  ok(nullFoo(null) === null);
  ok(nullFoo('foo') === 'foo');
  throws(function() { nullFoo('bar'); }, 'error');
});

test('type $array', function() {
  var arrayFoo = $array(function(x) {
    if (x === 'foo')
      return x;
    throw 'error';
  });
  deepEqual(arrayFoo([]), []);
  deepEqual(arrayFoo(['foo']), ['foo']);
  throws(function() { arrayFoo(['bar']) }, 'error');
});

test('type $model', function() {
  var ctorCalled = false;
  var ctorArg;
  var ctor = function(arg) {
    ctorCalled = true;
    ctorArg = arg;
  };
  var result = ($model(ctor))(42);
  ok(ctorCalled);
  equal(ctorArg, 42);
  ok(result instanceof ctor);
  ctorCalled = false;
  ($model(ctor))(result);
  ok(!ctorCalled);
});
