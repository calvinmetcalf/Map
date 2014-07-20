
module.exports = Map;
function Map(iterable) {
	this._gen = {};
	this.first = this.last = null;
	this._size = 0;
	if (iterable) {
		var len = iterable.length;
		var i = -1;
		var key, value;
		while (++i < len) {
			if (i % 2) {
				value = iterable[i];
				this.set(key, value);
			} else {
				key = iterable[i];
			}
		}
	}
}
var mp = Map.prototype;

mp._find = function (key) {
	if (!this._size) {
		return false;
	}
	if (!this.first || !this.last) {
		return false;
	}
	var item = this.first;
	while (item) {
		if (item.key === key || (key !== key && item.key !== item.key)) {
			return item;
		}
		item = item.next;
	}
};
mp.set = function (key, value) {
	var cur = this._find(key);
	if (cur === false) {
		var item = {
			key: key,
			value: value,
			next: undefined,
			prev: this.last
		}
		this.last.next = item;
		this.last = item;
		this._size++;
	} else {
		cur.value = value;
	}
	return this;
};
mp.get = function (key) {
	var pos = this._find(key);
	if (pos === false) {
		return;
	}
	return pos.value;
};
mp.delete = function (key, value) {
	var pos = this._find(key);
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
		return true;
	}
};
mp.clear = function () {
	this._size = 0;
	this._gen = {};
	var len = this.store.length;
	this.first = this.last = undefined;
};
mp.forEach(func) {
	var context = undefined;
	if (arguments.length > 1) {
		context = arguments[1];
	}
	var item = this.first;
	while (item) {
		func.call(context, item.value, item.key, this);
		item = item.next;
	}
}
mp.keys = function () {
	return new MapIterator(this, 'key');
}
mp.values = function () {
	return new MapIterator(this, 'values');
}
mp.entries = function () {
	return new MapIterator(this, 'key+value');
}
Object.defineProperty(mp, 'size', {
	get: function () {
		return this._size;
	}
})

function MapIterator(map, kind) {
	this.map = map;
	this.kind = kind;
	this._gen = this.map._gen;
	this.val = undefined;
}
MapIterator.prototype.next = function () {
	if (this._gen !== this.map._gen) {
		this.val = this.map.first;
		this._gen = this.map._gen;
	} else if (this.val === undefined) {
		this.val = this.map.first;
	} else {
		this.val = this.val.next;
	}
	var value;
	if (this.kind === 'keys') {
		value = this.val.key;
	} else if (this.kind === 'values') {
		value = this.val.value;
	} else {
		value = [this.val.key, this.val.value];
	}
	if (this.val.next) {
		return {
			done: false,
			value: value
		}
	} else {
		return {
			done: true,
			value: value
		}
	}
};