var MapIterator = require('./iterator');
var Store = require('./store');

module.exports = $Map;

function $Map(iterable) {
	this._gen = {};
	this.first = this.last = null;
	this._size = 0;
	this.store = new Store();
	if (iterable) {
		var len = iterable.length;
		var i = -1;
		while (++i < len) {
			value = iterable[i];
			this.set(value[0], value[1]);
		}
	}
}
var mp = $Map.prototype;

function find(self, key) {
	if (!self._size) {
		return false;
	}
	if (!self.first || !self.last) {
		return false;
	}
	if (self.cacheable(key)) {
		return self.store.get(key);
	}
	var item = self.first;
	while (item) {
		if (item.key === key || (key !== key && item.key !== item.key)) {
			return item;
		}
		item = item.next;
	}
	return false;
}
mp.set = function (key, value) {
	var cur = find(this, key);
	if (cur === false) {
		var item = new Item(key, value, this.last);
		if (this.last) {
			this.last.next = item;
		}
		if (!this.first) {
			this.first = item;
		}
		this.last = item;
		this._size++;
		if (this.cacheable(key)) {
			this.store.set(key, item);
		}
	} else {
		cur.value = value;
	}
	return this;
};
mp.get = function (key) {
	var pos = find(this, key);
	if (pos === false) {
		return;
	}
	return pos.value;
};
mp.delete = function (key, value) {
	var pos = find(this, key);
	if (pos === false) {
		return false;
	} else {
		if (pos === this.last && pos === this.first) {
			this.first = this.last = undefined;
		} else  if (pos === this.last) {
			this.last = this.last.prev;
			this.last.next = undefined;
		} else  if (pos === this.first) {
			this.first = this.first.next;
			this.first.prev = undefined;
		} else {
			pos.next.prev = pos.prev;
			pos.prev.next = pos.next;
		}
		this._size--;
		this.store.delete(key);
		return true;
	}
};
mp.clear = function () {
	this._size = 0;
	this._gen = {};
	this.first = this.last = undefined;
	this.store.clear();
};
mp.forEach = function (func) {
	var context;
	if (arguments.length > 1) {
		context = arguments[1];
	}
	var item = this.first;
	while (item) {
		func.call(context, item.value, item.key, this);
		item = item.next;
	}
};
mp.keys = function () {
	return new MapIterator(this, 'keys');
};
mp.values = function () {
	return new MapIterator(this, 'values');
};
mp.entries = function () {
	return new MapIterator(this, 'key+value');
};
Object.defineProperty(mp, 'size', {
	get: function () {
		return this._size;
	}
});
mp.cacheable = function (key) {
	if (typeof key !== 'object') {
		return true;
	} 
	if (Object.isExtensible(key)){
		return true;
	}
	return false;
};


function Item(key, value, prev) {
	this.key = key;
	this.value = value;
	this.prev = prev;
	this.next = undefined;
}