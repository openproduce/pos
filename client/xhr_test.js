var xhrTest = {};

module('xhr library', {
  setup: function() {
    xhrTest.xhr = sinon.useFakeXMLHttpRequest();
    xhrTest.requests = [];
    xhrTest.xhr.onCreate = function(request) {
      xhrTest.requests.push(request);
    };
  },
  tearDown: function() {
    xhrTest.xhr.restore();
  }
});

test('request with successful response', function() {
  var request = xhr.get('http://example.com:7357/foo');
  equal(xhrTest.requests.length, 1);
  equal(xhrTest.requests[0].method, 'GET');
  equal(xhrTest.requests[0].url, 'http://example.com:7357/foo');
  stop();
  request.then(function(response) {
    deepEqual(response, {'hello': 'world'});
    start();
  }, function() {
    ok(false, 'unexpected error status');
    start();
  });
  xhrTest.requests[0].respond(200, {"Content-Type": "application/json"},
      '{"hello": "world"}');
});

test('request with empty response', function() {
  var request = xhr.get('http://example.com:7357/foo');
  equal(xhrTest.requests.length, 1);
  equal(xhrTest.requests[0].method, 'GET');
  equal(xhrTest.requests[0].url, 'http://example.com:7357/foo');
  stop();
  request.then(function(response) {
    ok(true)
    start();
  }, function() {
    ok(false, 'unexpected error status');
    start();
  });
  xhrTest.requests[0].respond(204);
});

test('request with bad json response', function() {
  var request = xhr.get('http://example.com:7357/foo');
  equal(xhrTest.requests.length, 1);
  equal(xhrTest.requests[0].method, 'GET');
  equal(xhrTest.requests[0].url, 'http://example.com:7357/foo');
  stop();
  request.then(function(response) {
    ok(false, 'expecting error');
    start();
  }, function(err) {
    ok(!!err, 'json parse error');
    start();
  });
  xhrTest.requests[0].respond(200, {"Content-Type": "application/json"}, 'bad');
});

test('request with error response', function() {
  var request = xhr.get('http://example.com:7357/foo');
  equal(xhrTest.requests.length, 1);
  equal(xhrTest.requests[0].method, 'GET');
  equal(xhrTest.requests[0].url, 'http://example.com:7357/foo');
  stop();
  request.then(function(response) {
    ok(false, 'expecting error response');
    start();
  }, function(err) {
    equal(err.message, 'Not Found');
    equal(err.display, 'bummer dude');
    start();
  });
  xhrTest.requests[0].respond(404, null, JSON.stringify({'message': 'bummer dude'}));
});

test('request with network error', function() {
  var request = xhr.get('http://example.com:7357/foo');
  equal(xhrTest.requests.length, 1);
  equal(xhrTest.requests[0].method, 'GET');
  equal(xhrTest.requests[0].url, 'http://example.com:7357/foo');
  stop();
  request.then(function(response) {
    ok(false, 'expecting error');
    start();
  }, function(err) {
    equal(err.message, 'Network error');
    start();
  });
  xhrTest.requests[0].onerror();
});

test('request with default timeout', function() {
  var request = xhr.get('http://example.com:7357/foo');
  equal(xhrTest.requests.length, 1);
  equal(xhrTest.requests[0].method, 'GET');
  equal(xhrTest.requests[0].url, 'http://example.com:7357/foo');
  stop();
  request.then(function(response) {
    ok(false, 'expecting error');
    start();
  }, function(err) {
    equal(err.message, 'Network timeout');
    start();
  });
  xhrTest.requests[0].ontimeout();
});

test('request with custom timeout', function() {
  var request = xhr.get('http://example.com:7357/foo', 200);
  equal(xhrTest.requests.length, 1);
  equal(xhrTest.requests[0].method, 'GET');
  equal(xhrTest.requests[0].timeout, 200);
  equal(xhrTest.requests[0].url, 'http://example.com:7357/foo');
  stop();
  request.then(function(response) {
    ok(false, 'expecting error');
    start();
  }, function(err) {
    equal(err.message, 'Network timeout');
    start();
  });
  xhrTest.requests[0].ontimeout();
});

test('request with body and successful response', function() {
  var request = xhr.post('http://example.com:7357/foo', '{"hello": "world"}');
  equal(xhrTest.requests.length, 1);
  equal(xhrTest.requests[0].method, 'POST');
  equal(xhrTest.requests[0].url, 'http://example.com:7357/foo');
  ok(/^application\/json(;|$)/.test(xhrTest.requests[0].requestHeaders['Content-Type']));
  equal(xhrTest.requests[0].requestBody, '{"hello": "world"}');
  stop();
  request.then(function(response) {
    deepEqual(response, {'id': 42, 'hello': 'world'});
    start();
  }, function(err) {
    ok(false, 'unexpected error');
    start();
  });
  xhrTest.requests[0].respond(200, {"Content-Type": "application/json"},
      '{"id": 42, "hello": "world"}');
});
