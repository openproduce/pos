var restify = require('restify');
var data = require('./test-data.js');
var server = restify.createServer();
server.use(restify.bodyParser());

server.use(
  function(req, res, next) {
    console.log(req.method, req.url);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    return next();
  }
);

// GET /clerks.json returns all the clerks
server.get('/clerks.json', function(req, res, next) {
  res.send(data.DB.clerks);
  return next();
});

// GET /customers.json gets all the customers.
// POST /customers.json creates a new customer.
// PATCH /customers/:id.json updates an existing customer.
// GET /customers/:id/print_tab.json prints a customer's entire tab history.
server.get('/customers.json', function(req, res, next) {
  res.send(data.DB.customers);
  return next();
});

server.post('/customers.json', function(req, res, next) {
  var customer = req.body;
  console.log(customer);
  res.send(data.DB.insertOrUpdate(data.DB.customers, customer));
  return next();
});

server.patch(/^\/customers\/([-\w]+)\.json/, function(req, res, next) {
  var customerId = req.params[0];
  var customer = data.DB.find(data.DB.customers, customerId);
  if (!customer) {
    console.log('- no such customer');
    return next(new restify.InvalidArgumentError('no such customer ' + customerId));
  }
  var newCustomer = req.body;
  console.log(newCustomer);
  res.send(data.DB.insertOrUpdate(data.DB.customers, newCustomer));
  return next();
});

server.get(/^\/customers\/([-\w]+)\/print_tab\.json/, function(req, res, next) {
  res.send(204);
  return next();
});

// GET /items/since/:unixtime.json gets all items updated after unixtime.
server.get(/^\/items\/since\/(\d+)\.json/, function(req, res, next) {
  var unixtime = parseInt(req.params[0], 10);
  res.send(data.DB.items.filter(function(item) {
    return item.updatedAt > unixtime;
  }));
  return next();
});

// Sale entry
// POST /sales.json populates a new sale with some initial items.
// PUT /sales/:id/set_customer/:cust_id.json sets the customer for a sale.
// PATCH /sales/:id/add_item.json adds an item to a sale.
// PATCH /sales/:id/remove_item/:sale_item_id.json removes an item from a sale.
// POST /sales/:id/pay.json pays a sale.
server.post(/^\/sales\.json/, function(req, res, next) {
  var sale = req.body;
  console.log('request', sale);
  sale.saleItems = sale.saleItems.map(function(saleItem) {
    return data.DB.insertOrUpdate(data.DB.saleItems, saleItem);
  });
  res.send(data.DB.insertOrUpdate(data.DB.sales, sale));
  console.log('response', sale);
  return next();
});

server.put(/^\/sales\/([-\w]+)\/set_customer\/([-\w]+)\.json/, function(req, res, next) {
  var saleId = req.params[0];
  var customerId = req.params[1];
  var sale = data.DB.find(data.DB.sales, saleId);
  if (!sale) {
    console.log('- no such sale');
    return next(new restify.InvalidArgumentError('no such sale ' + saleId));
  }
  sale.customerId = customerId;
  res.send(sale);
  return next();
});

server.put(/^\/sales\/([-\w]+)\/clear_customer/, function(req, res, next) {
  var saleId = req.params[0];
  var sale = data.DB.find(data.DB.sales, saleId);
  if (!sale) {
    console.log('- no such sale');
    return next(new restify.InvalidArgumentError('no such sale ' + saleId));
  }
  sale.customerId = null;
  res.send(sale);
  return next();
});

server.put(/^\/sales\/([-\w]+)\/set_clerk\/([-\w]+)\.json/, function(req, res, next) {
  var saleId = req.params[0];
  var clerkId = req.params[1];
  var sale = data.DB.find(data.DB.sales, saleId);
  if (!sale) {
    console.log('- no such sale');
    return next(new restify.InvalidArgumentError('no such sale ' + saleId));
  }
  sale.clerkId = clerkId;
  res.send(sale);
  return next();
});

server.put(/^\/sales\/([-\w]+)\/clear_clerk/, function(req, res, next) {
  var saleId = req.params[0];
  var sale = data.DB.find(data.DB.sales, saleId);
  if (!sale) {
    console.log('- no such sale');
    return next(new restify.InvalidArgumentError('no such sale ' + saleId));
  }
  sale.clerkId = null;
  res.send(sale);
  return next();
});

server.patch(/^\/sales\/([-\w]+)\/add_item\.json/, function(req, res, next) {
  var saleId = req.params[0];
  var saleItem = req.body;
  var sale = data.DB.find(data.DB.sales, saleId);
  if (!sale) {
    console.log('- no such sale');
    return next(new restify.InvalidArgumentError('no such sale ' + saleId));
  }
  sale.saleItems.push(data.DB.insertOrUpdate(data.DB.saleItems, saleItem));
  console.log('response', sale);
  res.send(sale);
  return next();
});

server.patch(/^\/sales\/([-\w]+)\/remove_item\/([-\w]+)\.json/, function(req, res, next) {
  var saleId = req.params[0];
  var saleItemId = req.params[1];
  var sale = data.DB.find(data.DB.sales, saleId);
  if (!sale) {
    console.log('- no such sale');
    return next(new restify.InvalidArgumentError('no such sale ' + saleId));
  }
  var exclude = function(saleItem) {
    return saleItem.id !== saleItemId;
  };
  sale.saleItems = sale.saleItems.filter(exclude);
  data.DB.saleItems = data.DB.saleItems.filter(exclude);
  console.log('response', sale);
  res.send(sale);
  return next();
});

server.post(/^\/sales\/([-\w]+)\/pay.json/, function(req, res, next) {
  var saleId = req.params[0];
  var payment = req.body;
  console.log(payment);
  var sale = data.DB.find(data.DB.sales, saleId);
  if (!sale) {
    console.log('- no such sale');
    return next(new restify.InvalidArgumentError('no such sale ' + saleId));
  }
  if (payment.method == 'credit/debit' && payment.creditCard.cardNumber == '0') {
    console.log('- simulating declined');
    return next(new restify.InvalidArgumentError('Card was declined'));
  }
  sale.isPaid = true;
  if (sale.customerId === null && payment.customerId !== null)
    sale.customerId = payment.customerId;
  res.send(sale);
  return next();
});

// Sale review
// GET /sales/since/:unixtime.json gets all sales ended at or after unixtime.
// GET /sales/for_customer/:id.json gets 100 most recent sales for customer.
// GET /sales/:id/print_receipt.json prints a receipt for a sale.
// PUT /sales/:id/void.json voids a sale.
// PUT /sales/:id/unvoid.json unvoids a sale.
server.get(/^\/sales\/since\/(\d+)\.json/, function(req, res, next) {
  var unixtime = parseInt(req.params[0], unixtime);
  res.send(data.DB.sales.filter(function(sale) {
    return true; //sale.endTime >= req.params[0];
  }));
});

server.get(/^\/sales\/for_customer\/([-\w]+)\.json/, function(req, res, next) {
  res.send(data.DB.sales.filter(function(sale) {
    return sale.customerId == req.params[0];
  }));
});

server.get(/^\/sales\/([-\w]+)\/print_receipt\.json/, function(req, res, next) {
  res.send(204);
  return next();
});

server.put(/^\/sales\/([-\w]+)\/void\.json/, function(req, res, next) {
  var saleId = req.params[0];
  var sale = data.DB.find(data.DB.sales, saleId);
  if (!sale) {
    console.log('- no such sale');
    return next(new restify.InvalidArgumentError('no such sale ' + saleId));
  }
  sale.isVoid = true;
  res.send(sale);
  return next();
});

server.put(/^\/sales\/([-\w]+)\/unvoid\.json/, function(req, res, next) {
  var saleId = req.params[0];
  var sale = data.DB.find(data.DB.sales, saleId);
  if (!sale) {
    console.log('- no such sale');
    return next(new restify.InvalidArgumentError('no such sale ' + saleId));
  }
  sale.isVoid = false;
  res.send(sale);
  return next();
});

server.listen(8001, function() {
  console.log('%s listening at %s', server.name, server.url);
});
