// NetworkController reads data from and writes data to the server.
function NetworkController(args) {
  this.serverOrigin = args.serverOrigin;
  this.itemCache = new ItemCache({
    serverOrigin: args.serverOrigin,
    refreshInterval: 30 * 1000
  });
  this.itemCache.refresh();
}

// How long to wait for payment requests.
NetworkController.PAY_TIMEOUT = 30 * 1000;

// searchItems returns a promise for item models that match a query.
NetworkController.prototype.searchItems = function(query) {
  return this.itemCache.search(query);
};

// searchClerks returns a promise for clerk models that match a query.
NetworkController.prototype.searchClerks = function(query) {
  var search = function(clerks) {
    return clerks.filter(function(clerk) {
      return clerk.name.toLowerCase().indexOf(query.toLowerCase()) != -1;
    });
  };
  return xhr.get(this.serverOrigin + '/clerks.json')
            .then(parseModelArray.bind(undefined, Clerk))
            .then(search);
};

// searchCustomers returns a promise for customer models that match a query.
NetworkController.prototype.searchCustomers = function(query) {
  var search = function(customers) {
    return customers.filter(function(customer) {
      return customer.name.toLowerCase().indexOf(query.toLowerCase()) != -1;
    });
  };
  return xhr.get(this.serverOrigin + '/customers.json')
            .then(parseModelArray.bind(undefined, Customer))
            .then(search);
};

NetworkController.prototype.createSale = function(sale) {
  return xhr.post(this.serverOrigin + '/sales.json', JSON.stringify(sale))
            .then(function(response) {
              assert(response.id !== null);
              return new Sale(response);
            });
};

NetworkController.prototype.addItemToSale = function(sale, saleItem) {
  var requestUrl = this.serverOrigin + '/sales/' + sale.id + '/add_item.json';
  return xhr.patch(requestUrl, JSON.stringify(saleItem))
            .then(function(response) { return new Sale(response); });
};

NetworkController.prototype.removeItemFromSale = function(sale, saleItem) {
  var requestUrl = this.serverOrigin + '/sales/' + sale.id +
      '/remove_item/' + saleItem.id + '.json';
  return xhr.patch(requestUrl)
            .then(function(response) { return new Sale(response); });
};

NetworkController.prototype.setSaleCustomer = function(sale, customer) {
  if (customer) {
    var requestUrl = this.serverOrigin + '/sales/' + sale.id +
        '/set_customer/' + customer.id + '.json';
  } else {
    var requestUrl = this.serverOrigin + '/sales/' + sale.id +
        '/clear_customer.json';
  }
  return xhr.put(requestUrl)
            .then(function(response) { return new Sale(response); });
};

NetworkController.prototype.setSaleClerk = function(sale, clerk) {
  if (clerk) {
    var requestUrl = this.serverOrigin + '/sales/' + sale.id +
        '/set_clerk/' + clerk.id + '.json';
  } else {
    var requestUrl = this.serverOrigin + '/sales/' + sale.id +
        '/clear_clerk.json';
  }
  return xhr.put(requestUrl)
            .then(function(response) { return new Sale(response); });
};

NetworkController.prototype.paySale = function(payment) {
  var requestUrl = this.serverOrigin + '/sales/' + payment.saleId + '/pay.json';
  // Wait longer than usual before timing out payment requests because payment
  // processing is dog slow. Like, slow like a dog. A slow dog.
  return xhr.post(requestUrl, JSON.stringify(payment), null, NetworkController.PAY_TIMEOUT);
};

NetworkController.prototype.createCustomer = function(customer) {
  return xhr.post(this.serverOrigin + '/customers.json', JSON.stringify(customer))
            .then(function(response) { return new Customer(response); });
};

NetworkController.prototype.updateCustomer = function(customer) {
  var requestUrl = this.serverOrigin + '/customers/' + customer.id + '.json';
  return xhr.patch(requestUrl, JSON.stringify(customer))
            .then(function(response) { return new Customer(response); });
};

NetworkController.prototype.printTab = function(customer) {
  return xhr.get(this.serverOrigin + '/customers/' + customer.id + '/print_tab.json');
};

NetworkController.prototype.getSalesSince = function(timestamp) {
  return xhr.get(this.serverOrigin + '/sales/since/' + timestamp + '.json')
            .then(parseModelArray.bind(undefined, Sale));
};

NetworkController.prototype.getTabHistory = function(customer) {
  return xhr.get(this.serverOrigin + '/sales/for_customer/' + customer.id + '.json')
            .then(parseModelArray.bind(undefined, Sale));
};

NetworkController.prototype.printReceipt = function(sale) {
  return xhr.get(this.serverOrigin + '/sales/' + sale.id + '/print_receipt.json');
};

NetworkController.prototype.voidSale = function(sale) {
  return xhr.put(this.serverOrigin + '/sales/' + sale.id + '/void.json');
};

NetworkController.prototype.unvoidSale = function(sale) {
  return xhr.put(this.serverOrigin + '/sales/' + sale.id + '/unvoid.json');
};
