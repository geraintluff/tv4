"use strict";

//need to declare these for node and modern browsers
var tv4;
var assert;

if (typeof process === 'object' && typeof process.cwd !== 'undefined') {
	// NodeJS
	tv4 = require('./../').tv4;
	assert = require('proclaim');
}
else if (typeof window !== 'undefined') {
	// import for browser, use  from IE7/8 globals bypass
	assert = window.refs.assert;
	tv4 = window.refs.tv4;
}

//check if we got evrything
if (!assert) {
	throw new Error('assert no found');
}
if (!tv4) {
	throw new Error('tv4 not found');
}

//duck patch standard assert to chai
assert.property = function(object, property, message){
	if (typeof object[property] === 'undefined') {
		assert.fail(object, property, message, 'doesn\'t have property');
	}
};
assert.notProperty = function(object, property, message){
	if (typeof object[property] !== 'undefined') {
		assert.fail(object, property, message, 'has property');
	}
};

assert.propertyVal = function(object, property, value, message){
	assert.property(object, property, message);
	assert.strictEqual(object[property], value, message);
};
assert.propertyNotVal = function(object, property, value, message){
	assert.property(object, property, message);
	assert.notStrictEqual(object[property], value, message);
};

assert.lengthOf = function(object, length, message){
	if (typeof object['length'] === 'undefined') {
		assert.fail(object, 'length', message, 'doesn\'t have property');
	}
	if (object['length'] !== length) {
		assert.fail(object['length'], length, message, 'has length');
	}
};
assert.typeOf = function(object, type, message){
	if (typeof object !== type) {
		assert.fail(object, type, message, 'is not typeOf');
	}
};

/* jshint -W060 */

//end of header.js
