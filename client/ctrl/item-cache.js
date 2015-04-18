// ItemCache is an in-memory cache of items which is periodically refreshed by
// polling a server. It is used for fast incremental searching. The cache may
// also be forceably updated by calling update directly, for example when a
// sale response indicates that an item has changed.
function ItemCache(args) {
  this.serverOrigin = args.serverOrigin;
  this.refreshInterval = args.refreshInterval;

  this.items = {};
  this.refreshPending = false;
  this.lastUpdateTime = null;
}

// refresh does a GET request to retrieve new items. There can be at most one
// refresh pending at a time. Returns a promise for the current refresh.
ItemCache.prototype.refresh = function() {
  setTimeout(this.refresh.bind(this), this.refreshInterval);
  if (this.refreshPending)
    return;
  this.refreshPending = true;
  var url = this.serverOrigin + '/items/since/' +
      (this.lastUpdateTime || 0) + '.json'
  var unblock = function() {
    this.refreshPending = false;
  }.bind(this);
  return xhr.get(url)
     .then(parseModelArray.bind(undefined, Item))
     .then(this.update.bind(this))
     .then(unblock)
     .catch(unblock);
};

// update installs new items into the cache. Items are removed when they are
// marked 'discontinued'.
ItemCache.prototype.update = function(updates) {
  updates.forEach(function(item) {
    if (item.discontinued) {
      delete this.items[item.id];
    } else {
      this.items[item.id] = item;
    }
    this.lastUpdateTime = Math.max(this.lastUpdateTime, item.updatedAt);
  }, this);
};

// search returns a promise for an array of items that match query.
// Its interface is async because most searches really hit the network, so
// SearchFieldController expects that.
ItemCache.prototype.search = function(query) {
  if (!query) return Promise.resolve([]);
  var normQuery = query.toLowerCase().trim();
  var results = [];
  for (var id in this.items) {
    var item = this.items[id];
    if (item.plu == normQuery || item.barcode == normQuery ||
        item.desc.toLowerCase().indexOf(normQuery) != -1) {
      results.push(item);
    }
  }
  return Promise.resolve(results);
};
