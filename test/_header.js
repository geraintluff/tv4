"use strict";

//need to declare these for node and modern browsers
var tv4;
var assert;

if (typeof process === 'object' && typeof process.cwd !== 'undefined') {
	// NodeJS
	tv4 = require('./../').tv4;
	assert = require('proclaim');
	require('source-map-support').install();
}
else if (typeof window !== 'undefined') {
	// import for browser, use from IE7/8 global bypass
	assert = window.refs.assert;
	tv4 = window.refs.tv4;
}

//check if we got everything
if (!tv4) {
	throw new Error('tv4 not found');
}
if (!assert) {
	throw new Error('proclaim not found');
}
var helper = {};
helper.dumpJSON = function (value) {
	console.log(JSON.stringify(value, null, 2));
};


beforeEach(function () {
	tv4 = tv4.freshApi();
});


//duck patch standard assert to chai
//crappy wrappers
assert.property = function (object, property, message) {
	if (typeof object[property] === 'undefined') {
		assert.fail(object, property, message, 'have property');
	}
};
assert.notProperty = function (object, property, message) {
	if (typeof object[property] !== 'undefined') {
		assert.fail(object, property, message, 'not have property');
	}
};

assert.ownProperty = function (object, property, message) {
	if (!object.hasOwnProperty(property)) {
		assert.fail(object, property, message, 'have own property');
	}
};
assert.notOwnProperty = function (object, property, message) {
	if (object.hasOwnProperty(property)) {
		assert.fail(object, property, message, 'not have own property');
	}
};

//not ideal at all
assert.propertyVal = function (object, property, value, message) {
	assert.property(object, property, message);
	assert.strictEqual(object[property], value, message);
};
assert.propertyNotVal = function (object, property, value, message) {
	assert.property(object, property, message);
	assert.notStrictEqual(object[property], value, message);
};
assert.ownPropertyVal = function (object, property, value, message) {
	assert.ownProperty(object, property, message);
	assert.strictEqual(object[property], value, message);
};
assert.notOwnPropertyVal = function (object, property, value, message) {
	assert.notOwnProperty(object, property, message);
	assert.notStrictEqual(object[property], value, message);
};
//import when fix is pushed
assert.notOk = function (value, message) {
	if (!!value) {
		assert.fail(value, true, message, '!=');
	}
};

/* jshint -W060 */

//end of header.js
