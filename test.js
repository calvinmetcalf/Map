'use strict';
var test = require('prova');
var Map = require('./');

test('get', function (t) {
	t.plan(4);
	var a = {};
	var map = new Map([
		['foo', 'bar'],
		[-0, 'zero'],
		[a, 'a'],
		[NaN, 'nan']
	]);
	t.equals(map.get('foo'), 'bar', 'get string');
	t.equals(map.get(+0), 'zero', 'zeros work');
	t.equals(map.get(a), 'a', 'object references');
	t.equals(map.get(NaN), 'nan', 'nan references');
});

test('set', function (t) {
	t.plan(4);
	var a = {};
	var map = new Map([
		['foo', 'bar'],
		[-0, 'zero'],
		[a, 'a'],
		[NaN, 'nan']
	]);
	map.set('foo', 'baz');
	t.equals(map.get('foo'), 'baz', 'set string');
	map.set(+0, 'also zero')
	t.equals(map.get(0), 'also zero', 'zeros work');
	var c = {};
	map.set(c, 'c');
	t.equals(map.get(c), 'c', 'set object references');
	map.set(NaN, 'new nan');
	t.equals(map.get(NaN), 'new nan', 'set nan reference');
});

test('del and length', function (t) {
	t.plan(4);
	var a = {};
	var map = new Map([
		['foo', 'bar'],
		[-0, 'zero'],
		[a, 'a']
	]);
	t.equals(map.size, 3, 'correct size');
	t.size = 6;
	t.equals(map.size, 3, 'can\'t change the size');
	map.delete (a);
	t.equals(map.get(a), undefined, 'delete something');
	t.equals(map.size, 2, 'size changes');
});
test('forEach', function (t) {
	t.plan(12);
	var a = {};
	var items = [
		['foo', 'bar'],
		[-0, 'zero'],
		[a, 'a']
	];
	var map = new Map(items);
	var i = -1;
	map.forEach(function (value, key, m) {
		t.equals(key, items[++i][0], 'key ' + i);
		t.equals(value, items[i][1], 'value ' + i);
		t.equals(map, m, 'map ' + i);
		t.equals(this, undefined, 'this ' + i);
	});
});

test('clear', function (t) {
	t.plan(3);
	var a = {};
	var items = [
		['foo', 'bar'],
		[-0, 'zero'],
		[a, 'a']
	];
	var map = new Map(items);
	t.equals(map.size, 3, 'correct size');
	map.clear();
	t.equals(map.size, 0, 'correct size after clearing');
	map.set('lala', 'fafa');
	t.equals(map.size, 1, 'correct size after adding something');
});

test('iterators', function (t) {
	t.plan(3);
	t.test('keys', function (t) {
		t.plan(3);
		var a = {};
		var items = [
			['foo', 'bar'],
			[-0, 'zero'],
			[a, 'a']
		];
		var map = new Map(items);
		var iter = map.keys();
		t.deepEquals(iter.next(), {
			done: false,
			value: 'foo'
		});
		t.deepEquals(iter.next(), {
			done: false,
			value: -0
		});
		t.deepEquals(iter.next(), {
			done: true,
			value: a
		});
	});
	t.test('values', function (t) {
		t.plan(3);
		var a = {};
		var items = [
			['foo', 'bar'],
			[-0, 'zero'],
			[a, 'a']
		];
		var map = new Map(items);
		var iter = map.values();
		t.deepEquals(iter.next(), {
			done: false,
			value: 'bar'
		});
		t.deepEquals(iter.next(), {
			done: false,
			value: 'zero'
		});
		t.deepEquals(iter.next(), {
			done: true,
			value: 'a'
		});
	});
	t.test('entries', function (t) {
		t.plan(3);
		var a = {};
		var items = [
			['foo', 'bar'],
			[-0, 'zero'],
			[a, 'a']
		];
		var map = new Map(items);
		var iter = map.entries();
		t.deepEquals(iter.next(), {
			done: false,
			value: ['foo','bar']
		});
		t.deepEquals(iter.next(), {
			done: false,
			value: [-0, 'zero']
		});
		t.deepEquals(iter.next(), {
			done: true,
			value: [a, 'a']
		});
	});
});