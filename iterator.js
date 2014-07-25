'use strict';
module.exports = MapIterator;
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
    };
  } else {
    return {
      done: true,
      value: value
    };
  }
};