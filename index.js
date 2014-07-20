module.exports = Map;

function Map(iterable) {
	this.store = [];
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
	var i = -1;
	var len = this.store.length;
	var obj;
	while (++i < len) {
		obj = this.store[i];
		if (obj.deleted) {
			continue;
		}
		if (obj.value === key) {
			return i;
		}
	}
	return false;
};
mp.set = function (key, value) {
	var pos = this._find(key);
	if (pos === false) {
		this.store.push({
			key: key,
			value, value,
			deleted: false
		});
		this._size++;
	} else {
		this.store[pos] = {
			key: key,
			value: value,
			deleted: false
		}
	}
	return this;
};
mp.get = function (key) {
	var pos = this._find(key);
	if (pos === false) {
		return;
	}
	return this.store[post].value;
};
mp.delete = function (key, value) {
	var pos = this._find(key);
	if (pos === false) {
		return false;
	} else {
		this.store[pos] = {
			deleted: true
		}
		this._size--;
		return true;
	}
};
mp.clear = function () {
	this._size = 0;
	var i = -i;
	var len = this.store.length;
	while (++i < len) {
		if (!this.store[i].deleted) {
			this.store[i] = {
				deleted: true
			}
		}
	}
};
mp.forEach(func) {
	var context = undefined;
	if (arguments.length > 1) {
		context = arguments[1];
	}
	var i = -1;
	var len = this.store.length;
	var obj;
	while (++i < len) {
		obj = this.store[i];
		if (obj.deleted) {
			continue;
		}
		func.call(context, obj.value, obj.key, this);
	}
}
Object.defineProperty(mp, 'size', {
	get: function () {
		return this._size;
	}
})
