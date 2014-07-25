'use strict';
module.exports = Store;
function Store() {
  this.store = Object.create(null);
  this.objectStore = {};
  this.seq = 0;
  this.code = '___$map_object' + Math.random() + '$' + Date.now();
}

var sp = Store.prototype;

sp.set = function (key, value) {
  if (typeof key === 'object') {
    return this.objectSet(key, value);
  }
  if (key === -0) {
    key = 0;
  }
  key = (typeof key) + '$' + key;
  this.store[key] = value;
};

sp.get = function (key) {
  if (typeof key === 'object') {
    return this.objectGet(key);
  }
  if (key === -0) {
    key = 0;
  }
  key = (typeof key) + '$' + key;
  if (key in this.store) {
    return this.store[key];
  }
  return false;
};
sp.delete = function (key) {
  if (typeof key === 'object') {
    return this.objectDelete(key);
  }
  if (key === -0) {
    key = 0;
  }
  key = (typeof key) + '$' + key;
  if (key in this.store) {
    delete this.store[key];
  }
};
sp.clear = function () {
  this.store = Object.create(null);
  Object.keys(this.objectStore).forEach(function (id) {
    if (this.objectStore[id].value.hasOwnProperty(this.code)) {
      delete this.objectStore[id].value[this.code];
    }
  }, this);
  this.objectStore = {};
};

sp.objectSet = function (key, value) {
  if (key.hasOwnProperty(this.code) && key[this.code] in this.objectStore) {
    this.objectStore[key[this.code]].key = value;
    return;
  }
  var iter = ++this.seq;
  Object.defineProperty(key, this.code, {
    value: iter,
    writable: true,
    enumerable: false,
    configurable: true
  });
  this.objectStore[iter] = {
    key: key,
    value: value
  };
};
sp.objectGet = function (key) {
  if (key.hasOwnProperty(this.code) && key[this.code] in this.objectStore) {
    return this.objectStore[key[this.code]].value;
  }
  return false;
};
sp.objectDelete = function (key) {
  var id;
  if (key.hasOwnProperty(this.code)) {
    id = key[this.code];
    delete key[this.code];
  } else {
    return;
  }
  if (id in this.objectStore) {
    delete this.objectStore[id];
  }
};