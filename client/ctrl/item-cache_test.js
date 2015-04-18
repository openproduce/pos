var itemCacheTest = {};

module('item cache', {
  setup: function() {
    itemCacheTest.clock = sinon.useFakeTimers();
    itemCacheTest.xhr = sinon.useFakeXMLHttpRequest();
    itemCacheTest.requests = [];
    itemCacheTest.xhr.onCreate = function(request) {
      itemCacheTest.requests.push(request);
    };
  },
  tearDown: function() {
    itemCacheTest.clock.restore();
    itemCacheTest.xhr.restore();
  }
});

test('refresh skips if already pending', function() {
  var cache = new ItemCache({
    serverOrigin: 'http://example.com:7357',
    refreshInterval: 1000
  });
  cache.refresh();
  equal(itemCacheTest.requests.length, 1);
  equal(itemCacheTest.requests[0].url, 'http://example.com:7357/items/since/0.json');
  ok(cache.refreshPending);
  cache.refresh();
  equal(itemCacheTest.requests.length, 1);
});

test('refresh sends last update time', function() {
  var cache = new ItemCache({
    serverOrigin: 'http://example.com:7357',
    refreshInterval: 1000
  });
  cache.lastUpdateTime = 2345;
  cache.refresh();
  equal(itemCacheTest.requests.length, 1);
  equal(itemCacheTest.requests[0].url, 'http://example.com:7357/items/since/2345.json');
});

test('refresh sets timeout for next refresh', function() {
  var cache = new ItemCache({
    serverOrigin: 'http://example.com:7357',
    refreshInterval: 1000
  });
  var refresh = cache.refresh();
  equal(itemCacheTest.requests.length, 1);
  itemCacheTest.requests[0].respond(200, {"Content-Type": "application/json"}, 'bad');
  itemCacheTest.requests = [];
  stop();
  refresh.then(function() {
    itemCacheTest.clock.tick(1000);
    equal(itemCacheTest.requests.length, 1);
    start();
  });
});

test('update installs updates', function() {
  var cache = new ItemCache({
    serverOrigin: 'http://example.com:7357',
    refreshInterval: 1000
  });
  cache.items = {
    '0': new Item({'id': 0, 'desc': 'peas', 'costPerQty': '2.50', 'saleUnit': 'ea',
      'discontinued': false, 'plu': '', 'barcodes': ['12345678901'],
      'updatedAt': 0}),
    '1': new Item({'id': 1, 'desc': 'carrots', 'costPerQty': '2.50', 'saleUnit': 'ea',
      'discontinued': false, 'plu': '', 'barcodes': ['12345678902'],
      'updatedAt': 100}),
  };
  cache.update([
    new Item({'id': 0, 'desc': 'BETTAR peas', 'costPerQty': '2.50', 'saleUnit': 'ea',
      'discontinued': false, 'plu': '', 'barcodes': ['12345678901'],
      'updatedAt': 0}),
    new Item({'id': 1, 'desc': 'carrots', 'costPerQty': '2.50', 'saleUnit': 'ea',
      'discontinued': true, 'plu': '', 'barcodes': ['12345678902'],
      'updatedAt': 0}),
    new Item({'id': 2, 'desc': 'NEW carrots', 'costPerQty': '2.50', 'saleUnit': 'ea',
      'discontinued': false, 'plu': '', 'barcodes': ['12345678903'],
      'updatedAt': 100}),
  ]);
  deepEqual(cache.items, {
    '0': new Item({'id': 0, 'desc': 'BETTAR peas', 'costPerQty': '2.50', 'saleUnit': 'ea',
      'discontinued': false, 'plu': '', 'barcodes': ['12345678901'],
      'updatedAt': 0}),
    '2': new Item({'id': 2, 'desc': 'NEW carrots', 'costPerQty': '2.50', 'saleUnit': 'ea',
      'discontinued': false, 'plu': '', 'barcodes': ['12345678903'],
      'updatedAt': 100}),
  });
  equal(cache.lastUpdateTime, 100);
});

test('search returns empty for empty query', function() {
  var cache = new ItemCache({
    serverOrigin: 'http://example.com:7357',
    refreshInterval: 1000
  });
  cache.items = {
    '0': new Item({'id': 0, 'desc': 'guavas', 'costPerQty': '2.50', 'saleUnit': 'ea',
      'discontinued': false, 'plu': '4299', 'barcodes': [],
      'updatedAt': 0}),
    '1': new Item({'id': 1, 'desc': 'captain vomitberries', 'costPerQty':
      '2.50', 'saleUnit': 'ea', 'discontinued': false, 'plu': '', 'barcodes': ['14299429900'],
      'updatedAt': 100}),
  };
  stop();
  cache.search('').then(function(results) {
    deepEqual(results, []);
    start();
  });
});

test('search finds plu', function() {
  var cache = new ItemCache({
    serverOrigin: 'http://example.com:7357',
    refreshInterval: 1000
  });
  cache.items = {
    '0': new Item({'id': 0, 'desc': 'guavas', 'costPerQty': '2.50', 'saleUnit': 'ea',
      'discontinued': false, 'plu': '4299', 'barcodes': [],
      'updatedAt': 0}),
    '1': new Item({'id': 1, 'desc': 'captain vomitberries', 'costPerQty':
      '2.50', 'saleUnit': 'ea', 'discontinued': false, 'plu': '', 'barcodes': ['14299429900'],
      'updatedAt': 100}),
  };
  stop();
  cache.search('4299').then(function(results) {
    deepEqual(results, [
      new Item({'id': 0, 'desc': 'guavas', 'costPerQty': '2.50', 'saleUnit': 'ea',
        'discontinued': false, 'plu': '4299', 'barcodes': [],
        'updatedAt': 0}),
    ]);
    start();
  });
});

test('search finds barcode', function() {
  var cache = new ItemCache({
    serverOrigin: 'http://example.com:7357',
    refreshInterval: 1000
  });
  cache.items = {
    '0': new Item({'id': 0, 'desc': 'peas', 'costPerQty': '2.50', 'saleUnit': 'ea',
      'discontinued': false, 'plu': '', 'barcodes': ['123456789020'],
      'updatedAt': 0}),
    '1': new Item({'id': 1, 'desc': 'carrots', 'costPerQty': '2.50', 'saleUnit': 'ea',
      'discontinued': false, 'plu': '', 'barcodes': ['12345678902'],
      'updatedAt': 100}),
  };
  stop();
  cache.search('12345678902').then(function(results) {
    deepEqual(results, [
      new Item({'id': 1, 'desc': 'carrots', 'costPerQty': '2.50', 'saleUnit': 'ea',
          'discontinued': false, 'plu': '', 'barcodes': ['12345678902'],
          'updatedAt': 100})
    ]);
    start();
  });
});

test('search finds case-insensitive substring match', function() {
  var cache = new ItemCache({
    serverOrigin: 'http://example.com:7357',
    refreshInterval: 1000
  });
  cache.items = {
    '0': new Item({'id': 0, 'desc': 'peas', 'costPerQty': '2.50', 'saleUnit': 'ea',
      'discontinued': false, 'plu': '', 'barcodes': [],
      'updatedAt': 0}),
    '1': new Item({'id': 0, 'desc': 'persimmons', 'costPerQty': '2.50', 'saleUnit': 'ea',
      'discontinued': false, 'plu': '', 'barcodes': [],
      'updatedAt': 0}),
    '2': new Item({'id': 1, 'desc': 'carrots', 'costPerQty': '2.50', 'saleUnit': 'ea',
      'discontinued': false, 'plu': '', 'barcodes': [],
      'updatedAt': 100}),
  };
  stop();
  cache.search('pe').then(function(results) {
    results.sort(function(a, b) {
      return a.id - b.id;
    });
    deepEqual(results, [
      new Item({'id': 0, 'desc': 'peas', 'costPerQty': '2.50', 'saleUnit': 'ea',
        'discontinued': false, 'plu': '', 'barcodes': [],
        'updatedAt': 0}),
      new Item({'id': 0, 'desc': 'persimmons', 'costPerQty': '2.50', 'saleUnit': 'ea',
        'discontinued': false, 'plu': '', 'barcodes': [],
        'updatedAt': 0}),
    ]);
    start();
  });
});
