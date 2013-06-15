"use strict";

var tv4;
var chai;
var assert;

if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
	// NodeJS
	tv4 = require('./../').tv4;
	chai = require('chai');
	assert = chai.assert;
}
else {
	// Browser
	assert = chai.assert;
}
/* jshint -W060 */

//end of header.js
