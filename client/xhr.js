var xhr = {};

// By default, kill requests that take longer than 5 seconds.
xhr.TIMEOUT = 5 * 1000;

// xhr.request wraps an asynchronous XMLHttpRequest in a promise.
// See http://www.html5rocks.com/en/tutorials/es6/promises/
xhr.request = function(method, url, bodyJson, opt_timeout) {
  return new Promise(function(resolve, reject) {
    var req = new XMLHttpRequest();
    req.open(method, url);
    req.timeout = opt_timeout || xhr.TIMEOUT;
    if (bodyJson) {
      // NB POSTing JSON cross-origin needs an extra OPTIONS request and
      // round trip not needed for form encoded data, because the web is a big
      // pile of stupid. This is ok because most of our requests are GET or PUT.
      // See http://www.html5rocks.com/en/tutorials/cors/#toc-types-of-cors-requests
      req.setRequestHeader('Content-Type', 'application/json');
    }
    req.onload = function() {
      var hundredsDigitOfStatus = ~~(req.status / 100);
      try {
        var parsedResponse = JSON.parse(req.responseText);
      } catch (error) {
        var jsonError = error;
      }
      if (req.status == 204) {
        resolve();
      } else if (hundredsDigitOfStatus == 2) {
        if (!jsonError)
          resolve(parsedResponse); 
        else
          reject(jsonError);
      } else {
        var error = new Error(req.statusText);
        if (!jsonError && parsedResponse.message)
          error.display = parsedResponse.message;
        reject(error);
      }
    };
    req.ontimeout = function() {
      reject(Error("Network timeout"), {});
    }
    req.onerror = function() {
      reject(Error('Network error'), {});
    };
    req.send(bodyJson);
  });
}

// get returns a promise for an HTTP GET request to url.
xhr.get = function(url, opt_timeout) {
  return xhr.request('GET', url, null, opt_timeout);
}

// put returns a promise for an HTTP PUT request to url.
xhr.put = function(url, opt_timeout) {
  return xhr.request('PUT', url, null, opt_timeout);
}

// post returns a promise for an HTTP POST request to url with body json.
xhr.post = function(url, json, opt_timeout) {
  return xhr.request('POST', url, json, opt_timeout);
}

// patch returns a promise for an HTTP PATCH request to url with body json.
xhr.patch = function(url, json, opt_timeout) {
  return xhr.request('PATCH', url, json, opt_timeout);
}
