var restify = require('restify');
var data = require('./test-data.js');
var server = restify.createServer();
server.use(restify.bodyParser());

server.use(
  function crossOrigin(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    return next();
  }
);

// GET /clerks.json returns all the clerks
server.get('/clerks.json', function(req, res, next) {
  console.log('GET /clerks.json');
  res.send(data.DB.clerks);
  return next();
});

// GET /customers.json gets all the customers.
// POST /customers.json creates a new customer.
// PATCH /customers/:id.json updates an existing customer.
// GET /customers/:id/print_tab.json prints a customer's entire tab history.
server.get('/customers.json', function(req, res, next) {
  console.log('GET /customers.json');
  res.send(data.DB.customers);
  return next();
});

server.post('/customers.json', function(req, res, next) {
  console.log('POST /customers.json');
  var customer = req.body;
  console.log(customer);
  res.send(data.DB.insertOrUpdate(data.DB.customers, customer));
  return next();
});

server.patch(/^\/customers\/(\d+)\.json/, function(req, res, next) {
  var customerId = parseInt(req.params[0], 10);
  console.log('PATCH /customers/' + customerId + '.json');
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

server.get(/^\/customers\/(\d+)\/print_tab\.json/, function(req, res, next) {
  console.log('GET /customers/' + req.params[0] + '/print_tab.json');
  res.send(204);
  return next();
});

// GET /items/since/:unixtime.json gets all items updated after unixtime.
server.get(/^\/items\/since\/(\d+).json/, function(req, res, next) {
  console.log('GET /items/since/' + req.params[0] + '.json');
  res.send(data.DB.items.filter(function(item) {
    return item.updatedAt > req.params[0];
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
  console.log('POST /sales.json');
  var sale = req.body;
  console.log('request', sale);
  sale.saleItems = sale.saleItems.map(function(saleItem) {
    return data.DB.insertOrUpdate(data.DB.saleItems, saleItem);
  });
  res.send(data.DB.insertOrUpdate(data.DB.sales, sale));
  console.log('response', sale);
  return next();
});

server.put(/^\/sales\/(\d+)\/set_customer\/(\d+)\.json/, function(req, res, next) {
  var saleId = parseInt(req.params[0], 10);
  var customerId = parseInt(req.params[1], 10);
  console.log('PUT /sales/' + saleId + '/set_customer/' + customerId + '.json');
  var sale = data.DB.find(data.DB.sales, saleId);
  if (!sale) {
    console.log('- no such sale');
    return next(new restify.InvalidArgumentError('no such sale ' + saleId));
  }
  sale.customerId = customerId;
  res.send(sale);
  return next();
});

server.put(/^\/sales\/(\d+)\/clear_customer/, function(req, res, next) {
  var saleId = parseInt(req.params[0], 10);
  console.log('PUT /sales/' + saleId + '/clear_customer.json');
  var sale = data.DB.find(data.DB.sales, saleId);
  if (!sale) {
    console.log('- no such sale');
    return next(new restify.InvalidArgumentError('no such sale ' + saleId));
  }
  sale.customerId = null;
  res.send(sale);
  return next();
});

server.put(/^\/sales\/(\d+)\/set_clerk\/(\d+)\.json/, function(req, res, next) {
  var saleId = parseInt(req.params[0], 10);
  var clerkId = parseInt(req.params[1], 10);
  console.log('PUT /sales/' + saleId + '/set_clerk/' + clerkId + '.json');
  var sale = data.DB.find(data.DB.sales, saleId);
  if (!sale) {
    console.log('- no such sale');
    return next(new restify.InvalidArgumentError('no such sale ' + saleId));
  }
  sale.clerkId = clerkId;
  res.send(sale);
  return next();
});

server.put(/^\/sales\/(\d+)\/clear_clerk/, function(req, res, next) {
  var saleId = parseInt(req.params[0], 10);
  console.log('PUT /sales/' + saleId + '/clear_clerk.json');
  var sale = data.DB.find(data.DB.sales, saleId);
  if (!sale) {
    console.log('- no such sale');
    return next(new restify.InvalidArgumentError('no such sale ' + saleId));
  }
  sale.clerkId = null;
  res.send(sale);
  return next();
});

server.patch(/^\/sales\/(\d+)\/add_item\.json/, function(req, res, next) {
  var saleId = parseInt(req.params[0], 10);
  var saleItem = req.body;
  console.log('PATCH /sales/' + saleId + '/add_item.json');
  console.log('request', saleItem);

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

server.patch(/^\/sales\/(\d+)\/remove_item\/(\d+)\.json/, function(req, res, next) {
  var saleId = parseInt(req.params[0], 10);
  var saleItemId = parseInt(req.params[1], 10);
  console.log('PATCH /sales/' + saleId + '/remove_item/' + saleItemId + '.json');
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

server.post(/^\/sales\/(\d+)\/pay.json/, function(req, res, next) {
  var saleId = parseInt(req.params[0], 10);
  console.log('POST /sales/' + saleId + '/pay.json');
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
  console.log('GET /sales/since/' + req.params[0] + '.json');
  res.send(data.DB.sales.filter(function(sale) {
    return true; //sale.endTime >= req.params[0];
  }));
});

server.get(/^\/sales\/for_customer\/(\d+)\.json/, function(req, res, next) {
  console.log('GET /sales/for_customer/' + req.params[0] + '.json');
  res.send(data.DB.sales.filter(function(sale) {
    return sale.customerId == req.params[0];
  }));
});

server.get(/^\/sales\/(\d+)\/print_receipt\.json/, function(req, res, next) {
  console.log('GET /sales/' + req.params[0] + '/print_receipt.json');
  res.send(204);
  return next();
});

server.put(/^\/sales\/(\d+)\/void\.json/, function(req, res, next) {
  var saleId = parseInt(req.params[0], 10);
  console.log('PUT /sales/' + saleId + '/void.json');
  var sale = data.DB.find(data.DB.sales, saleId);
  if (!sale) {
    console.log('- no such sale');
    return next(new restify.InvalidArgumentError('no such sale ' + saleId));
  }
  sale.isVoid = true;
  res.send(sale);
  return next();
});

server.put(/^\/sales\/(\d+)\/unvoid\.json/, function(req, res, next) {
  var saleId = parseInt(req.params[0], 10);
  console.log('PUT /sales/' + saleId + '/unvoid.json');
  var sale = data.DB.find(data.DB.sales, saleId);
  if (!sale) {
    console.log('- no such sale');
    return next(new restify.InvalidArgumentError('no such sale ' + saleId));
  }
  sale.isVoid = false;
  res.send(sale);
  return next();
});

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
