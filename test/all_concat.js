"use strict";

//need to declare these for node and modern browsers
var tv4;
var assert;

if (typeof process === 'object' && typeof process.cwd !== 'undefined') {
	// NodeJS
	tv4 = require('./../').tv4;
	assert = require('proclaim');
	require('source-map-support').install();

	var fs = require('fs');
	var getJSON = function (file) {
		var json;
		try {
			json = JSON.parse(fs.readFileSync(file, 'utf8'));
		}
		catch (e) {
			assert.fail(e, null, file + ': ' + String(e), 'getJSON');
		}
		assert.isObject(json, file);
		return json;
	};
	assert.isFile = function(file, msg) {
		if (!fs.existsSync(file)){
			assert.fail(false, true, msg + ': missing file ' + file, 'existsSync');
		}
	};

	describe('Verify package definition files', function (){
		var pkg;
		var component;
		var bower;
		it('pkg', function () {
			pkg = getJSON('./package.json');

			assert.property(pkg, 'main', 'main');
			assert.isFile(pkg.main, 'main');
		});
		it('component', function () {
			component = getJSON('./component.json');

			assert.property(component, 'main', 'main');
			assert.isFile(component.main, 'main');

			component.scripts.forEach(function(name) {
				assert.isFile(name, 'scripts');
			});
		});
		it('bower', function () {
			bower = getJSON('./bower.json');

			assert.property(bower, 'main', 'main');
			assert.isFile(bower.main, 'main');

			// should verify ignore field
		});
	});
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
//quick-and-dirty wrappers
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
assert.propertyValues = function (object, properties, value, message) {
	assert.isObject(object, message);
	assert.isObject(properties, message);
	//copy properties
	var props = {};
	for (var name in properties) {
		props[name] = object[name];
	}
	assert.deepEqual(props, properties, message);
};
//import when fix is pushed
assert.notOk = function (value, message) {
	if (!!value) {
		assert.fail(value, true, message, '!=');
	}
};

/* jshint -W060 */

//end of header.js

describe("Core 01", function () {

	it("getDocumentUri returns only location part of url", function () {

		assert.strictEqual(tv4.getDocumentUri("http://example.com"), "http://example.com");

		assert.strictEqual(tv4.getDocumentUri("http://example.com/main"), "http://example.com/main");
		assert.strictEqual(tv4.getDocumentUri("http://example.com/main/"), "http://example.com/main/");
		//assert.strictEqual(tv4.getDocumentUri("http://example.com/main//"), "http://example.com/main/");

		assert.strictEqual(tv4.getDocumentUri("http://example.com/main/sub"), "http://example.com/main/sub");
		assert.strictEqual(tv4.getDocumentUri("http://example.com/main/sub/"), "http://example.com/main/sub/");

		assert.strictEqual(tv4.getDocumentUri("http://example.com/main#"), "http://example.com/main");
		assert.strictEqual(tv4.getDocumentUri("http://example.com/main/sub/#"), "http://example.com/main/sub/");

		assert.strictEqual(tv4.getDocumentUri("http://example.com/main?"), "http://example.com/main?");
		assert.strictEqual(tv4.getDocumentUri("http://example.com/main?q=1"), "http://example.com/main?q=1");
		assert.strictEqual(tv4.getDocumentUri("http://example.com/main?q=1#abc"), "http://example.com/main?q=1");

		assert.strictEqual(tv4.getDocumentUri("http://example.com/main/#"), "http://example.com/main/");
		assert.strictEqual(tv4.getDocumentUri("http://example.com/main/#?"), "http://example.com/main/");
		assert.strictEqual(tv4.getDocumentUri("http://example.com/main/#?q=a/b/c"), "http://example.com/main/");
	});
});

describe("Core 02", function () {

	it("tv4.freshApi() produces working copy", function () {
		var duplicate = tv4.freshApi();
		assert.isObject(duplicate);
		// Basic sanity checks
		assert.isTrue(duplicate.validate({}, {type: "object"}));
		assert.isObject(duplicate.validateMultiple("string", {}));
	});

	it("tv4.freshApi() has separate schema store", function () {
		var duplicate = tv4.freshApi();
		
		var schemaUrl1 = "http://example.com/schema/schema1";
		var schemaUrl2 = "http://example.com/schema/schema2";
		duplicate.addSchema(schemaUrl1, {});
		tv4.addSchema(schemaUrl2, {});
		
		assert.isObject(duplicate.getSchema(schemaUrl1));
		assert.isUndefined(tv4.getSchema(schemaUrl1));
		assert.isUndefined(duplicate.getSchema(schemaUrl2));
		assert.isObject(tv4.getSchema(schemaUrl2));
	});
});

describe("Core 03", function () {

	it("tv4.dropSchemas() drops stored schemas", function () {
		var schema = {
			"items": {"$ref": "http://example.com/schema/items#"},
			"maxItems": 2
		};
		tv4.addSchema("http://example.com/schema", schema);
		assert.strictEqual(tv4.getSchema("http://example.com/schema"), schema, "has schema");

		tv4.dropSchemas();
		assert.isUndefined(tv4.getSchema("http://example.com/schema"), "doesn't have schema");
	});

	it("tv4.reset() clears errors, valid and missing", function () {
		it("must be string, is integer", function () {
			var data = 5;
			var schema = {"type": "array", "items" : {"$ref" : "http://example.com"}};

			assert.notOk(tv4.error, "starts with no error");
			assert.isTrue(tv4.valid, "starts valid");
			assert.length(tv4.missing, 0, "starts with 0 missing");

			var valid = tv4.validate(data, schema);
			assert.isFalse(valid);
			assert.ok(tv4.error, "has error");
			assert.isFalse(tv4.valid, "is invalid");
			assert.length(tv4.missing, 1, "missing 1");

			tv4.reset();
			assert.notOk(tv4.error, "reset to no error");
			assert.isTrue(tv4.valid, "reset to valid");
			assert.length(tv4.missing, 0, "reset to 0 missing");
		});
	});
});

describe("Core 04", function () {

	var schema = {
		"type": "string"
	};

	it("ValidationError is Error subtype", function () {
		var res = tv4.validateResult(123, schema);
		assert.isObject(res);
		assert.isObject(res.error);
		assert.isInstanceOf(res.error, Error);
		assert.isString(res.error.stack);
	});

	it("ValidationError has own stack trace", function () {
		function errorA() {
			var res = tv4.validateResult(123, schema);
			assert.isFalse(res.valid);
			assert.isString(res.error.stack);
			assert.ok(res.error.stack.indexOf('errorA') > -1, 'has own stack trace A');
		}

		function errorB() {
			var res = tv4.validateResult(123, schema);
			assert.isFalse(res.valid);
			assert.isString(res.error.stack);
			assert.ok(res.error.stack.indexOf('errorB') > -1, 'has own stack trace B');
		}
		errorA();
		errorB();
	});
});

describe("Any types 01", function () {

	it("no type specified", function () {
		var data = {};
		var schema = {};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("must be object, is object", function () {
		var data = {};
		var schema = {"type": "object"};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("must be object or string, is object", function () {
		var data = {};
		var schema = {"type": ["object", "string"]};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("must be object or string, is array", function () {
		var data = [];
		var schema = {"type": ["object", "string"]};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});

	it("must be array, is object", function () {
		var data = {};
		var schema = {"type": ["array"]};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});

	it("must be string, is integer", function () {
		var data = 5;
		var schema = {"type": ["string"]};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});

	it("must be object, is null", function () {
		var data = null;
		var schema = {"type": ["object"]};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});

	it("must be null, is null", function () {
		var data = null;
		var schema = {"type": "null"};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});
});

describe("Any types 01", function () {

	it("enum [1], was 1", function () {
		var data = 1;
		var schema = {"enum": [1]};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("enum [1], was \"1\"", function () {
		var data = "1";
		var schema = {"enum": [1]};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});

	it("enum [{}], was {}", function () {
		var data = {};
		var schema = {"enum": [
			{}
		]};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("enum [{\"key\":\"value\"], was {}", function () {
		var data = {};
		var schema = {"enum": [
			{"key": "value"}
		]};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});

	it("enum [{\"key\":\"value\"], was {\"key\": \"value\"}", function () {
		var data = {};
		var schema = {"enum": [
			{"key": "value"}
		]};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});

	it("Enum with array value - success", function () {
		var data = [1, true, 0];
		var schema = {"enum": [
			[1, true, 0],
			5,
			{}
		]};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("Enum with array value - failure 1", function () {
		var data = [1, true, 0, 5];
		var schema = {"enum": [
			[1, true, 0],
			5,
			{}
		]};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});

	it("Enum with array value - failure 2", function () {
		var data = [1, true, 5];
		var schema = {"enum": [
			[1, true, 0],
			5,
			{}
		]};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});
});

describe("Numberic 01", function () {

	it("multipleOf", function () {
		var data = 5;
		var schema = {"multipleOf": 2.5};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("multipleOf failure", function () {
		var data = 5;
		var schema = {"multipleOf": 0.75};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});
});
describe("Numberic 02", function () {

	it("minimum success", function () {
		var data = 5;
		var schema = {minimum: 2.5};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("minimum failure", function () {
		var data = 5;
		var schema = {minimum: 7};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});

	it("minimum equality success", function () {
		var data = 5;
		var schema = {minimum: 5};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("minimum equality failure", function () {
		var data = 5;
		var schema = {minimum: 5, exclusiveMinimum: true};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});

	it("maximum success", function () {
		var data = 5;
		var schema = {maximum: 7};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("maximum failure", function () {
		var data = -5;
		var schema = {maximum: -10};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});

	it("maximum equality success", function () {
		var data = 5;
		var schema = {maximum: 5};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("maximum equality failure", function () {
		var data = 5;
		var schema = {maximum: 5, exclusiveMaximum: true};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});
});

describe("Strings 01", function () {

	it("no length constraints", function () {
		var data = "test";
		var schema = {};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("minimum length success", function () {
		var data = "test";
		var schema = {minLength: 3};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("minimum length failure", function () {
		var data = "test";
		var schema = {minLength: 5};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});

	it("maximum length success", function () {
		var data = "test1234";
		var schema = {maxLength: 10};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("maximum length failure", function () {
		var data = "test1234";
		var schema = {maxLength: 5};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});

	it("check error message", function () {
		var data = "test1234";
		var schema = {maxLength: 5};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
		//return typeof tv4.error.message !== "undefined";
		assert.ok(tv4.error.message);
	});
});

describe("Strings 02", function () {

	it("pattern success", function () {
		var data = "9test";
		var schema = {"pattern": "^[0-9][a-zA-Z]*$"};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("pattern failure", function () {
		var data = "9test9";
		var schema = {"pattern": "^[0-9][a-zA-Z]*$"};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});
});
describe("Arrays 01", function () {

	it("no length constraints", function () {
		var data = [1, 2, 3];
		var schema = {};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("minimum length success", function () {
		var data = [1, 2, 3];
		var schema = {minItems: 3};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("minimum length failure", function () {
		var data = [1, 2, 3];
		var schema = {minItems: 5};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});

	it("maximum length success", function () {
		var data = [1, 2, 3, 4, 5];
		var schema = {maxItems: 10};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("maximum length failure", function () {
		var data = [1, 2, 3, 4, 5];
		var schema = {maxItems: 3};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});
});

describe("Arrays 02", function () {

	it("uniqueItems success", function () {
		var data = [1, true, "1"];
		var schema = {uniqueItems: true};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("uniqueItems failure", function () {
		var data = [1, true, "1", 1];
		var schema = {uniqueItems: true};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});
});

describe("Arrays 03", function () {

	it("plain items success", function () {
		var data = [1, 2, 3, 4];
		var schema = {
			"items": {
				"type": "integer"
			}
		};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("plain items failure", function () {
		var data = [1, 2, true, 3];
		var schema = {
			"items": {
				"type": "integer"
			}
		};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});
});

describe("Arrays 04", function () {

	it("plain items success", function () {
		var data = [1, true, "one"];
		var schema = {
			"items": [
				{"type": "integer"},
				{"type": "boolean"}
			]
		};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("plain items failure", function () {
		var data = [1, null, "one"];
		var schema = {
			"items": [
				{"type": "integer"},
				{"type": "boolean"}
			]
		};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});
});

describe("Arrays 05", function () {

	it("additional items schema success", function () {
		var data = [1, true, "one", "uno"];
		var schema = {
			"items": [
				{"type": "integer"},
				{"type": "boolean"}
			],
			"additionalItems": {"type": "string"}
		};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("additional items schema failure", function () {
		var data = [1, true, "one", 1];
		var schema = {
			"items": [
				{"type": "integer"},
				{"type": "boolean"}
			],
			"additionalItems": {"type": "string"}
		};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});

	it("additional items boolean success", function () {
		var data = [1, true, "one", "uno"];
		var schema = {
			"items": [
				{"type": "integer"},
				{"type": "boolean"}
			],
			"additionalItems": true
		};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("additional items boolean failure", function () {
		var data = [1, true, "one", "uno"];
		var schema = {
			"items": [
				{"type": "integer"},
				{"type": "boolean"}
			],
			"additionalItems": false
		};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});
});

describe("Objects 01", function () {

	it("minimum length success", function () {
		var data = {key1: 1, key2: 2, key3: 3};
		var schema = {minProperties: 3};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("minimum length failure", function () {
		var data = {key1: 1, key2: 2, key3: 3};
		var schema = {minProperties: 5};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});

	it("maximum length success", function () {
		var data = {key1: 1, key2: 2, key3: 3};
		var schema = {maxProperties: 5};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("maximum length failure", function () {
		var data = {key1: 1, key2: 2, key3: 3};
		var schema = {maxProperties: 2};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});
});

describe("Objects 02", function () {

	it("required success", function () {
		var data = {key1: 1, key2: 2, key3: 3};
		var schema = {required: ["key1", "key2"]};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("required failure", function () {
		var data = {key1: 1, key2: 2, key3: 3};
		var schema = {required: ["key1", "notDefined"]};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});
});

describe("Objects 03", function () {

	it("properties success", function () {
		var data = {intKey: 1, stringKey: "one"};
		var schema = {
			properties: {
				intKey: {"type": "integer"},
				stringKey: {"type": "string"}
			}
		};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("properties failure", function () {
		var data = {intKey: 1, stringKey: false};
		var schema = {
			properties: {
				intKey: {"type": "integer"},
				stringKey: {"type": "string"}
			}
		};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});
});

describe("Objects 04", function () {

	it("patternProperties success", function () {
		var data = {intKey: 1, intKey2: 5};
		var schema = {
			properties: {
				intKey: {"type": "integer"}
			},
			patternProperties: {
				"^int": {minimum: 0}
			}
		};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("patternProperties failure 1", function () {
		var data = {intKey: 1, intKey2: 5};
		var schema = {
			properties: {
				intKey: {minimum: 5}
			},
			patternProperties: {
				"^int": {"type": "integer"}
			}
		};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});

	it("patternProperties failure 2", function () {
		var data = {intKey: 10, intKey2: "string value"};
		var schema = {
			properties: {
				intKey: {minimum: 5}
			},
			patternProperties: {
				"^int": {"type": "integer"}
			}
		};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});
});

describe("Objects 05", function () {

	it("additionalProperties schema success", function () {
		var data = {intKey: 1, intKey2: 5, stringKey: "string"};
		var schema = {
			properties: {
				intKey: {"type": "integer"}
			},
			patternProperties: {
				"^int": {minimum: 0}
			},
			additionalProperties: {"type": "string"}
		};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("patternProperties schema failure", function () {
		var data = {intKey: 10, intKey2: 5, stringKey: null};
		var schema = {
			properties: {
				intKey: {minimum: 5}
			},
			patternProperties: {
				"^int": {"type": "integer"}
			},
			additionalProperties: {"type": "string"}
		};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});

	it("patternProperties boolean success", function () {
		var data = {intKey: 10, intKey2: 5, stringKey: null};
		var schema = {
			properties: {
				intKey: {minimum: 5}
			},
			patternProperties: {
				"^int": {"type": "integer"}
			},
			additionalProperties: true
		};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("patternProperties boolean failure", function () {
		var data = {intKey: 10, intKey2: 5, stringKey: null};
		var schema = {
			properties: {
				intKey: {minimum: 5}
			},
			patternProperties: {
				"^int": {"type": "integer"}
			},
			additionalProperties: false
		};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});

	it("additionalProperties inherited property success", function () {
		function DataMaker(o) {
			var self = this;
			Object.keys(o).forEach(function(key) {
				self[key] = o[key];
			});
		}
		DataMaker.prototype.extraMethod = function() {};
		var schema = {
			properties: {
				foo: {"type": "boolean"}
			},
			additionalProperties: false
		};
		var data = new DataMaker({foo: true});
		tv4.normSchema(schema);
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("additionalProperties non-enumerable property success", function () {
		var schema = {
			properties: {
				foo: {"type": "boolean"}
			},
			additionalProperties: false
		};
		var data = {};
		Object.defineProperty(data, 'hidden', {
			value: 0
		});
		tv4.normSchema(schema);
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});
});
describe("Objects 06", function () {

	it("string dependency success", function () {
		var data = {key1: 5, key2: "string"};
		var schema = {
			dependencies: {
				key1: "key2"
			}
		};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("string dependency failure", function () {
		var data = {key1: 5};
		var schema = {
			dependencies: {
				key1: "key2"
			}
		};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});

	it("array dependency success", function () {
		var data = {key1: 5, key2: "string"};
		var schema = {
			dependencies: {
				key1: ["key2"]
			}
		};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("array dependency failure", function () {
		var data = {key1: 5};
		var schema = {
			dependencies: {
				key1: ["key2"]
			}
		};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});

	it("schema dependency success", function () {
		var data = {key1: 5, key2: "string"};
		var schema = {
			dependencies: {
				key1: {
					properties: {
						key2: {"type": "string"}
					}
				}
			}
		};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("schema dependency failure", function () {
		var data = {key1: 5, key2: 5};
		var schema = {
			dependencies: {
				key1: {
					properties: {
						key2: {"type": "string"}
					}
				}
			}
		};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});
});

describe("Objects 07", function () {

	// used by multiple tests
	function DataObject() {}
	DataObject.prototype.getData = function() {};
	var data = new DataObject();
	data.stringKey = "string value";
	var schema = {
		properties: {
			"stringKey": {"type": "string"}
		},
		additionalProperties: false
	};

	it("inherited properties are ignored by default", function () {
		var valid = tv4.validateResult(data, schema).valid;
		assert.isTrue(valid);
	});

	it("inherited properties are validated when checkInheritedProperties is true", function () {
		var valid = tv4.validateResult(data, schema, {checkInheritedProperties: true}).valid;
		assert.isFalse(valid);
	});

});

describe("Objects 08", function () {

	// used by multiple tests
	var data = {"stringKey": "string value"};
	Object.defineProperty(data, "extraKey", {value: "extra value"});
	var schema = {
		properties: {
			"stringKey": {"type": "string"}
		},
		additionalProperties: false
	};

	it("non-enumerable properties are ignored by default", function () {
		var valid = tv4.validateResult(data, schema).valid;
		assert.isTrue(valid);
	});

	it("non-enumerable properties are validated when checkNonEnumerableProperties is true", function () {
		var valid = tv4.validateResult(data, schema, {checkNonEnumerableProperties: true}).valid;
		assert.isFalse(valid);
	});

});

describe("Combinators 01", function () {

	it("allOf success", function () {
		var data = 10;
		var schema = {
			"allOf": [
				{"type": "integer"},
				{"minimum": 5}
			]
		};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("allOf failure", function () {
		var data = 1;
		var schema = {
			"allOf": [
				{"type": "integer"},
				{"minimum": 5}
			]
		};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});
});

describe("Combinators 02", function () {

	it("anyOf success", function () {
	var data = "hello";
	var schema = {
		"anyOf": [
			{"type": "integer"},
			{"type": "string"},
			{"minLength": 1}
		]
	};
	var valid = tv4.validate(data, schema);
	assert.isTrue(valid);
});

it("anyOf failure", function () {
	var data = true;
	var schema = {
		"anyOf": [
			{"type": "integer"},
			{"type": "string"}
		]
	};
	var valid = tv4.validate(data, schema);
	assert.isFalse(valid);
});
});

describe("Combinators 03", function () {

	it("oneOf success", function () {
		var data = 5;
		var schema = {
			"oneOf": [
				{"type": "integer"},
				{"type": "string"},
				{"type": "string", minLength: 1}
			]
		};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("oneOf failure (too many)", function () {
		var data = "string";
		var schema = {
			"oneOf": [
				{"type": "integer"},
				{"type": "string"},
				{"minLength": 1}
			]
		};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});

	it("oneOf failure (no matches)", function () {
		var data = false;
		var schema = {
			"oneOf": [
				{"type": "integer"},
				{"type": "string"},
				{"type": "string", "minLength": 1}
			]
		};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});
});

describe("Combinators 04", function () {

	it("not success", function () {
		var data = 5;
		var schema = {
			"not": {"type": "string"}
		};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("not failure", function () {
		var data = "test";
		var schema = {
			"not": {"type": "string"}
		};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});
});

describe("$ref 01", function () {

	it("normalise - untouched immediate $ref", function () {
		var schema = {
			"items": {"$ref": "#"}
		};
		tv4.normSchema(schema);
		assert.propertyVal(schema.items, '$ref', "#");
		//return schema.items['$ref'] == "#";
	});

	it("normalise - id as base", function () {
		var schema = {
			"id": "baseUrl",
			"items": {"$ref": "#"}
		};
		tv4.normSchema(schema);
		assert.propertyVal(schema.items, '$ref', "baseUrl#");
		//return schema.items['$ref'] == "baseUrl#";
	});

	it("normalise - id relative to parent", function () {
		var schema = {
			"id": "http://example.com/schema",
			"items": {
				"id": "otherSchema",
				"items": {
					"$ref": "#"
				}
			}
		};
		tv4.normSchema(schema);
		assert.strictEqual(schema.items.id, "http://example.com/otherSchema", "schema.items.id");
		assert.strictEqual(schema.items.items['$ref'], "http://example.com/otherSchema#", "$ref");
		//this.assert(schema.items.id == "http://example.com/otherSchema", "schema.items.id");
		//this.assert(schema.items.items['$ref'] == "http://example.com/otherSchema#", "$ref");
	});

	it("normalise - do not touch contents of \"enum\"", function () {
		var schema = {
			"id": "http://example.com/schema",
			"items": {
				"id": "otherSchema",
				"enum": [
					{
						"$ref": "#"
					}
				]
			}
		};
		tv4.normSchema(schema);
		assert.strictEqual(schema.items['enum'][0]['$ref'], "#");
		//this.assert(schema.items['enum'][0]['$ref'] == "#");
	});

	it("Only normalise id and $ref if they are strings", function () {
		var schema = {
			"properties": {
				"id": {"type": "integer"},
				"$ref": {"type": "integer"}
			}
		};
		var data = {"id": "test", "$ref": "test"};
		tv4.normSchema(schema);
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});
});

describe("$ref 02", function () {

	it("skip unneeded", function () {
		var schema = {
			"items": {"$ref": "http://example.com/schema#"}
		};
		tv4.validate([], schema);
		assert.notProperty(tv4.missing, "http://example.com/schema");
		assert.length(tv4.missing, 0);
		//return !tv4.missing["http://example.com/schema"]
		//	&& tv4.missing.length == 0;
	});

	it("list missing (map)", function () {
		var schema = {
			"items": {"$ref": "http://example.com/schema#"}
		};
		tv4.validate([1, 2, 3], schema);
		assert.property(tv4.missing, "http://example.com/schema");
		//return !!tv4.missing["http://example.com/schema"];
	});

	it("list missing (index)", function () {
		var schema = {
			"items": {"$ref": "http://example.com/schema#"}
		};
		tv4.validate([1, 2, 3], schema);
		assert.length(tv4.missing, 1);
		assert.strictEqual(tv4.missing[0], "http://example.com/schema");
		//return tv4.missing[0] == "http://example.com/schema";
	});
});
describe("$ref 03", function () {

	it("addSchema(), getSchema()", function () {
		var url = "http://example.com/schema";
		var schema = {
			"test": "value"
		};
		tv4.addSchema(url, schema);
		var fetched = tv4.getSchema(url);
		assert.strictEqual(fetched.test, "value");
		//return fetched.test == "value";
	});

	it("addSchema(), getSchema() with blank fragment", function () {
		var url = "http://example.com/schema";
		var schema = {
			"test": "value"
		};
		tv4.addSchema(url, schema);
		var fetched = tv4.getSchema(url + "#");
		assert.strictEqual(fetched.test, "value");
		//return fetched.test == "value";
	});

	it("addSchema(), getSchema() with pointer path fragment", function () {
		var url = "http://example.com/schema";
		var schema = {
			"items": {
				"properties": {
					"key[]": {
						"inner/key~": "value"
					}
				}
			}
		};
		tv4.addSchema(url, schema);
		var fetched = tv4.getSchema(url + "#/items/properties/key%5B%5D/inner~1key~0");
		assert.strictEqual(fetched, "value");
		//return fetched == "value";
	});

	it("addSchema(), getSchema() adds referred schemas", function () {
		tv4 = tv4.freshApi();

		var data = [123, true];
		var valid;
		var url = "http://example.com/schema";
		var schema = {
			"type": "array",
			"items": {"$ref": "http://example.com/schema/sub#item"}
		};
		tv4.addSchema(url, schema);

		//test missing
		valid = tv4.validate(data, schema);
		assert.isTrue(valid);
		assert.length(tv4.missing, 1);
		assert.isUndefined(tv4.getSchema('http://example.com/schema/sub'));

		var item = {
			"id": "#item",
			"type": "boolean"
		};
		var sub = {
			"id": "http://example.com/schema/sub",
			"type": "object",
			"lib": {
				"item": item
			}
		};
		tv4.addSchema(sub);

		//added it?
		assert.equal(tv4.getSchema(url), schema);
		assert.equal(tv4.getSchema('http://example.com/schema/sub'), sub);
		assert.equal(tv4.getSchema('http://example.com/schema/sub#item'), item);

		//now use it
		valid = tv4.validate(data, schema);
		assert.length(tv4.missing, 0);
		assert.isFalse(valid);

		var error = {
			code: 0,
			message: 'invalid type: number (expected boolean)',
			dataPath: '/0',
			schemaPath: '/items/type',
			subErrors: null };
		assert.propertyValues(tv4.error, error);
	});
});
describe("$ref 04", function () {

	it("addSchema(), $ref", function () {
		var url = "http://example.com/schema";
		var schema = {
			"test": "value"
		};
		tv4.addSchema(url, schema);

		var otherSchema = {
			"items": {"$ref": url}
		};
		var valid = tv4.validate([0,1,2,3], otherSchema);

		assert.isTrue(valid, "should be valid");
		assert.length(tv4.missing, 0, "should have no missing schemas");

		//this.assert(valid, "should be valid");
		//this.assert(tv4.missing.length == 0, "should have no missing schemas");
	});

	it("internal $ref", function () {
		var schema = {
			"type": "array",
			"items": {"$ref": "#"}
		};

		assert.isTrue(tv4.validate([[],[[]]], schema), "List of lists should be valid");
		assert.isTrue(!tv4.validate([0,1,2,3], schema), "List of ints should not");
		assert.isTrue(!tv4.validate([[true], []], schema), "List of list with boolean should not");

		assert.length(tv4.missing, 0, "should have no missing schemas");

		//this.assert(tv4.validate([[],[[]]], schema), "List of lists should be valid");
		//this.assert(!tv4.validate([0,1,2,3], schema), "List of ints should not");
		//this.assert(!tv4.validate([[true], []], schema), "List of list with boolean should not");

		//this.assert(tv4.missing.length == 0, "should have no missing schemas");
	});
});

describe("$ref 05", function () {

	it("inline addressing for fragments", function () {
		var schema = {
			"type": "array",
			"items": {"$ref": "#test"},
			"testSchema": {
				"id": "#test",
				"type": "boolean"
			}
		};
		var error = {
			code: 0,
			message: 'invalid type: number (expected boolean)',
			dataPath: '/0',
			schemaPath: '/items/type',
			subErrors: null
		};

		var data = [0, false];
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid, 'inline addressing invalid 0, false');
		assert.propertyValues(tv4.error, error, 'errors equal');
	});

	it("don't trust non sub-paths", function () {
		var examplePathBase = "http://example.com/schema";
		var examplePath = examplePathBase + "/schema";
		var schema = {
			"id": examplePath,
			"type": "array",
			"items": {"$ref": "other-schema"},
			"testSchema": {
				"id": "/other-schema",
				"type": "boolean"
			}
		};
		tv4.addSchema(examplePath, schema);
		var data = [0, false];
		var valid = tv4.validate(data, examplePath);

		assert.length(tv4.missing, 1, "should have missing schema");
		assert.strictEqual(tv4.missing[0], examplePathBase + "/other-schema", "incorrect schema missing: " + tv4.missing[0]);
		assert.isTrue(valid, "should pass, as remote schema not found");

		//this.assert(tv4.missing.length == 1, "should have missing schema");
		//this.assert(tv4.missing[0] == examplePathBase + "/other-schema", "incorrect schema missing: " + tv4.missing[0]);
		//this.assert(valid, "should pass, as remote schema not found");
	});
});

describe("$refs to $refs", function () {
	it("addSchema(), $ref", function () {
		var schema = {
			id: "http://example.com/schema",
			some: {
				other: {type: "number"}
			},
			data: {'$ref': "#/some/other"}
		};
		
		tv4.addSchema(schema);
		assert.isTrue(tv4.validate(42, {"$ref": "http://example.com/schema#/data"}), "42 valid");
		//assert.isFalse(tv4.validate(42, {"$ref": "http://example.com/schema#/data"}), "\"42\" invalid");
		
		assert.length(tv4.missing, 0, "should have no missing schemas");
	});

	it("Don't hang on circle", function () {
		var schema = {
			id: "http://example.com/schema",
			ref1: {"$ref": "#/ref2"},
			ref2: {"$ref": "#/ref1"}
		};
		
		tv4.addSchema(schema);
		var result = tv4.validateResult(42, "http://example.com/schema#/ref1");
		
		assert.isFalse(result.valid, "not valid");
		assert.equal(result.error.code, tv4.errorCodes.CIRCULAR_REFERENCE, 'Error code correct');
	});
});

describe("API 01", function () {

	it("validateResult returns object with appropriate properties", function () {
		var data = {};
		var schema = {"type": "array"};
		tv4.error = null;
		tv4.missing = [];
		var result = tv4.validateResult(data, schema);

		assert.isFalse(result.valid, "result.valid === false");
		assert.isTypeOf(result.error, "object", "result.error is object");
		assert.isArray(result.missing, "result.missing is array");
		assert.isFalse(!!tv4.error, "tv4.error == null");

		//this.assert(result.valid === false, "result.valid === false");
		//this.assert(typeof result.error == "object", "result.error is object");
		//this.assert(Array.isArray(result.missing), "result.missing is array");
		//this.assert(tv4.error == null, "tv4.error == null");
	});
});

describe("API 02", function () {

	it("tv4.errorCodes exists", function () {
		assert.isObject(tv4.errorCodes);
		//return typeof tv4.errorCodes == "object";
	});
});

describe("API 03", function () {

	it("getSchemaUris() on clean tv4 returns an empty array", function () {
		var list = tv4.getSchemaUris();
		assert.isArray(list);
		assert.length(list, 0);
	});

	it("getSchemaUris() returns newly added schema urls", function () {
		tv4.addSchema("http://example.com/schema", {type: "object"});
		var list = tv4.getSchemaUris();
		assert.isArray(list);
		assert.length(list, 1);
		assert.strictEqual(list[0], "http://example.com/schema");
	});

	it("getMissingUris() returns only missing items", function () {
		var schema = {
			"items": {"$ref": "http://example.com/schema/item#"}
		};
		tv4.addSchema("http://example.com/schema/main", schema);

		var item = {
			"id": "http://example.com/schema/item",
			"type": "boolean"
		};

		var list;
		list = tv4.getSchemaUris();
		assert.isArray(list);
		assert.length(list, 1);
		assert.includes(list, "http://example.com/schema/main", 'map has main uri');

		list = tv4.getMissingUris();
		assert.isArray(list);
		assert.length(list, 1);
		assert.includes(list, "http://example.com/schema/item", 'map has item uri');

		tv4.addSchema(item);

		list = tv4.getMissingUris();
		assert.isArray(list);
		assert.length(list, 0);
	});

	it("getSchemaUris() optionally return filtered items", function () {
		var schema = {
			"items": {"$ref": "http://example.com/schema/item#"}
		};
		tv4.addSchema("http://example.com/schema/main", schema);

		var list;
		list = tv4.getSchemaUris(/schema\/main/);
		assert.isArray(list);
		assert.length(list, 1, 'list 1 main');
		assert.includes(list, "http://example.com/schema/main");

		list = tv4.getMissingUris(/^https?/);
		assert.isArray(list);
		assert.length(list, 1, 'list 1 item');
		assert.includes(list, "http://example.com/schema/item");
	});

	it("getSchemaUris() returns unique uris without fragment", function () {
		var schema = {
			"properties": {
				"alpha": {
					"$ref": "http://example.com/schema/lib#alpha"
				},
				"beta": {
					"$ref": "http://example.com/schema/lib#beta"
				}
			}
		};
		tv4.addSchema("http://example.com/schema/main", schema);
		var sub = {
			"id": "http://example.com/schema/item",
			"items": {
				"type": "boolean"
			}
		};
		tv4.addSchema(sub);

		var list;
		list = tv4.getSchemaUris();
		assert.isArray(list);
		assert.length(list, 2);
		assert.includes(list, "http://example.com/schema/main");
		assert.includes(list, "http://example.com/schema/item");

		list = tv4.getMissingUris();
		assert.isArray(list);
		assert.length(list, 1);
		assert.includes(list, "http://example.com/schema/lib");
	});


	it("getSchemaMap() on clean tv4 returns an empty object", function () {
		var map = tv4.getSchemaMap();
		assert.isObject(map);
		assert.isNotArray(map);
		var list = Object.keys(map);
		assert.length(list, 0);
	});

	it("getSchemaMap() returns an object mapping uris to schemas", function () {
		var schema = {
			"properties": {
				"alpha": {
					"$ref": "http://example.com/schema/lib#alpha"
				},
				"beta": {
					"$ref": "http://example.com/schema/lib#beta"
				}
			}
		};
		tv4.addSchema("http://example.com/schema/main", schema);
		var sub = {
			"id": "http://example.com/schema/item",
			"items": {
				"type": "boolean"
			}
		};
		tv4.addSchema(sub);

		var map;
		map = tv4.getSchemaMap();
		assert.length(Object.keys(map), 2);
		assert.ownPropertyVal(map, "http://example.com/schema/main", schema);
		assert.ownPropertyVal(map, "http://example.com/schema/item", sub);
	});
});

describe("API 04", function () {

	// used in multiple tests
	var a = {};
	var b = { a: a };
	a.b = b;
	var aSchema = { properties: { b: { $ref: 'bSchema' }}};
	/*jshint unused:false */
	var bSchema = { properties: { a: { $ref: 'aSchema' }}};
	var data = {"a": a, "beta": true};
	var options = {
		checkRecursive: true,
		banUnknownProperties: true
	};

	it("validate works correctly with an options object", function () {
		var isValid = tv4.validate(data, aSchema, options);
		assert.isFalse(isValid);
	});

	it("validate works correctly with checkRecursive and banUnknownProperties parameters", function () {
		var isValid = tv4.validate(data, aSchema, true, true);
		assert.isFalse(isValid);
	});

	it("validateResult works correctly with an options object", function () {
		var result = tv4.validateResult(data, aSchema, options);
		assert.isObject(result.error);
		assert.strictEqual(result.error.code, 1000);
	});

	it("validateResult works correctly with checkRecursive and banUnknownProperties parameters", function () {
		var result = tv4.validateResult(data, aSchema, true, true);
		assert.isObject(result.error);
		assert.strictEqual(result.error.code, 1000);
	});

	it("validateMultiple works correctly with an options object", function () {
		var result = tv4.validateMultiple(data, aSchema, options);
		assert.isArray(result.errors);
		assert.length(result.errors, 2);
	});

	it("validateMultiple works correctly with checkRecursive and banUnknownProperties parameters", function () {
		var result = tv4.validateMultiple(data, aSchema, true, true);
		assert.isArray(result.errors);
		assert.length(result.errors, 2);
	});
});

describe("Multiple errors 01", function () {

	it("validateMultiple returns array of errors", function () {
		var data = {};
		var schema = {"type": "array"};
		var result = tv4.validateMultiple(data, schema);

		assert.isFalse(result.valid, "data should not be valid");
		assert.strictEqual(typeof result.errors, "object", "result.errors must be object");
		assert.isNumber(result.errors.length, "result.errors have numberic length");

		//-> weird: test says be object but it's an array

		//assert.isArray(result.errors, "result.errors must be array-like");
		//assert.isObject(result.errors, "result.errors must be object");

		//this.assert(result.valid == false, "data should not be valid");
		//this.assert(typeof result.errors == "object" && typeof result.errors.length == "number", "result.errors must be array-like");
	});

	it("validateMultiple has multiple entries", function () {
		var data = {"a": 1, "b": 2};
		var schema = {"additionalProperties": {"type": "string"}};
		var result = tv4.validateMultiple(data, schema);

		assert.length(result.errors, 2, "should return two errors");
		//this.assert(result.errors.length == 2, "should return two errors");
	});

	it("validateMultiple correctly fails anyOf", function () {
		var data = {};
		var schema = {
			"anyOf": [
				{"type": "string"},
				{"type": "integer"}
			]
		};
		var result = tv4.validateMultiple(data, schema);

		assert.isFalse(result.valid, "should not validate");
		assert.length(result.errors, 1, "should list one error");

		//this.assert(result.valid == false, "should not validate");
		//this.assert(result.errors.length == 1, "should list one error");
	});

	it("validateMultiple correctly fails not", function () {
		var data = {};
		var schema = {
			"not": {"type": "object"}
		};
		var result = tv4.validateMultiple(data, schema);

		assert.isFalse(result.valid, "should not validate");
		assert.length(result.errors, 1, "should list one error");

		//this.assert(result.valid == false, "should not validate");
		//this.assert(result.errors.length == 1, "should list one error");
	});

	it("validateMultiple correctly passes not", function () {
		var data = {};
		var schema = {
			"not": {"type": "string"}
		};
		var result = tv4.validateMultiple(data, schema);

		assert.isTrue(result.valid, "should validate");
		assert.length(result.errors, 0, "no errors");

		//this.assert(result.valid == true, "should validate");
		//this.assert(result.errors.length == 0, "no errors");
	});

	it("validateMultiple correctly fails multiple oneOf", function () {
		var data = 5;
		var schema = {
			"oneOf": [
				{"type": "integer"},
				{"type": "number"}
			]
		};
		var result = tv4.validateMultiple(data, schema);

		assert.isFalse(result.valid, "should not validate");
		assert.length(result.errors, 1, "only one error");

		//this.assert(result.valid == false, "should not validate");
		//this.assert(result.errors.length == 1, "only one error");
	});

	it("validateMultiple handles multiple missing properties", function () {
		var data = {};
		var schema = {
			required: ["one", "two"]
		};
		var result = tv4.validateMultiple(data, schema);

		assert.isFalse(result.valid, "should not validate");
		assert.length(result.errors, 2, "two errors");

		//this.assert(result.valid == false, "should not validate");
		//this.assert(result.errors.length == 2, "exactly two errors, not " + result.errors.length);
	});
});
describe("Multiple errors 02", function () {

	it("validateMultiple returns array of errors", function () {
		var data = {
			"alternatives": {
				"option1": "pattern for option 1"
			}
		};

		var schema = {
			"type": "object",
			"properties": {
				"alternatives": {
					"type": "object",
					"description": "Some options",
					"oneOf": [
						{
							"properties": {
								"option1": {
									"type": "string",
									"pattern": "^pattern for option 1$"
								}
							},
							"additionalProperties": false,
							"required": [
								"option1"
							]
						},
						{
							"properties": {
								"option2": {
									"type": "string",
									"pattern": "^pattern for option 2$"
								}
							},
							"additionalProperties": false,
							"required": [
								"option2"
							]
						},
						{
							"properties": {
								"option3": {
									"type": "string",
									"pattern": "^pattern for option 3$"
								}
							},
							"additionalProperties": false,
							"required": [
								"option3"
							]
						}
					]
				}
			}
		};
		var result = tv4.validateMultiple(data, schema);

		assert.isTrue(result.valid, "data should be valid");
		assert.length(result.errors, 0, "should have no errors");

		//this.assert(result.valid == true, "data should be valid");
		//this.assert(result.errors.length == 0, "should have no errors");
	});
});
describe("Recursive objects 01", function () {
	it("validate and variants do not choke on recursive objects", function () {
		var itemA = {};
		var itemB = { a: itemA };
		itemA.b = itemB;
		var aSchema = { properties: { b: { $ref: 'bSchema' }}};
		var bSchema = { properties: { a: { $ref: 'aSchema' }}};
		tv4.addSchema('aSchema', aSchema);
		tv4.addSchema('bSchema', bSchema);
		tv4.validate(itemA, aSchema, true);
		tv4.validate(itemA, aSchema, function () {}, true);
		tv4.validateResult(itemA, aSchema, true);
		tv4.validateMultiple(itemA, aSchema, true);
	});
});

describe("Registering custom validator", function () {
	it("Allows registration of custom validator codes for \"format\" values", function () {
		tv4.addFormat('test-format', function () {
			return null;
		});
	});

	it("Custom validator is correctly selected", function () {
		tv4.addFormat('test-format', function (data) {
			if (data !== "test string") {
				return "string does not match";
			}
		});
		
		var schema = {format: 'test-format'};
		var data1 = "test string";
		var data2 = "other string";
		
		assert.isTrue(tv4.validate(data1, schema));
		assert.isFalse(tv4.validate(data2, schema));
		assert.includes(tv4.error.message, 'string does not match');
	});

	it("Custom validator object error format", function () {
		tv4.addFormat('test-format', function (data) {
			if (data !== "test string") {
				return {
					dataPath: "",
					schemaPath: "/flah",
					message: "Error message"
				};
			}
		});
		
		var schema = {format: 'test-format'};
		var data1 = "test string";
		var data2 = "other string";
		
		assert.isTrue(tv4.validate(data1, schema));
		assert.isFalse(tv4.validate(data2, schema));
		assert.includes(tv4.error.message, 'Error message');
		assert.equal(tv4.error.schemaPath, '/flah');
	});

	it("Register multiple using object", function () {
		tv4.addFormat({
			'test1': function () {return 'break 1';},
			'test2': function () {return 'break 2';}
		});
		
		var schema1 = {format: 'test1'};
		var result1 = tv4.validateResult("test string", schema1);
		assert.isFalse(result1.valid);
		assert.includes(result1.error.message, 'break 1');

		var schema2 = {format: 'test2'};
		var result2 = tv4.validateResult("test string", schema2);
		assert.isFalse(result2.valid);
		assert.includes(result2.error.message, 'break 2');
	});
});

describe("Ban unknown properties 01", function () {
	it("Additional argument to ban additional properties", function () {
		var schema = {
			properties: {
				propA: {},
				propB: {}
			}
		};
		var data = {
			propA: true,
			propUnknown: true
		};
		var data2 = {
			propA: true
		};
		
		var result = tv4.validateMultiple(data, schema, false, true);
		assert.isFalse(result.valid, "Must not be valid");

		var result2 = tv4.validateMultiple(data2, schema, false, true);
		assert.isTrue(result2.valid, "Must still validate");
	});

	it("Works with validateResult()", function () {
		var schema = {
			properties: {
				propA: {},
				propB: {}
			}
		};
		var data = {
			propA: true,
			propUnknown: true
		};
		var data2 = {
			propA: true
		};
		
		var result = tv4.validateResult(data, schema, false, true);
		assert.isFalse(result.valid, "Must not be valid");

		var result2 = tv4.validateResult(data2, schema, false, true);
		assert.isTrue(result2.valid, "Must be valid");
	});

	it("Do not complain if additionalArguments is specified", function () {
		var schema = {
			properties: {
				propA: {},
				propB: {}
			},
			additionalProperties: true
		};
		var data = {
			propA: true,
			propUnknown: true
		};
		var data2 = {
			propA: true
		};
		
		var result = tv4.validateMultiple(data, schema, false, true);
		assert.isTrue(result.valid, "Must be valid");

		var result2 = tv4.validateMultiple(data2, schema, false, true);
		assert.isTrue(result2.valid, "Must still validate");
	});
});

describe("Ban unknown properties 02", function () {
	it("Do not track property definitions from \"not\"", function () {
		var schema = {
			"not": {
				properties: {
					propA: {"type": "string"},
				}
			}
		};
		var data = {
			propA: true,
		};
		
		var result = tv4.validateMultiple(data, schema, false, true);
		assert.isFalse(result.valid, "Must not be valid");
	});

	it("Do not track property definitions from unselected \"oneOf\"", function () {
		var schema = {
			"oneOf": [
				{
					"type": "object",
					"properties": {
						"propA": {"type": "string"}
					}
				},
				{
					"type": "object",
					"properties": {
						"propB": {"type": "boolean"}
					}
				}
			]
		};
		var data = {
			propA: true,
			propB: true
		};
		
		var result = tv4.validateMultiple(data, schema, false, true);
		assert.isFalse(result.valid, "Must not be valid");

		var result2 = tv4.validateMultiple(data, schema, false);
		assert.isTrue(result2.valid, "Must still be valid without flag");
	});


	it("Do not track property definitions from unselected \"anyOf\"", function () {
		var schema = {
			"anyOf": [
				{
					"type": "object",
					"properties": {
						"propA": {"type": "string"}
					}
				},
				{
					"type": "object",
					"properties": {
						"propB": {"type": "boolean"}
					}
				}
			]
		};
		var data = {
			propA: true,
			propB: true
		};
		
		var result = tv4.validateMultiple(data, schema, false, true);
		assert.isFalse(result.valid, "Must not be valid");

		var result2 = tv4.validateMultiple(data, schema, false);
		assert.isTrue(result2.valid, "Must still be valid without flag");
	});
});

describe("Fill dataPath for \"required\" (GitHub Issue #103)", function () {
	it("Blank for first-level properties", function () {
		var schema = {
			required: ['A']
		};
		var data = {};
		
		var result = tv4.validateMultiple(data, schema, false, true);
		console.log(result);
		assert.isFalse(result.valid, "Must not be valid");
		assert.deepEqual(result.errors[0].dataPath, '/A');
	});

	it("Filled for second-level properties", function () {
		var schema = {
			properties: {
				"foo": {
					required: ["bar"]
				}
			}
		};
		var data = {"foo": {}};
		
		var result = tv4.validateMultiple(data, schema, false, true);
		assert.isFalse(result.valid, "Must not be valid");
		assert.deepEqual(result.errors[0].dataPath, '/foo/bar');
	});
});

describe("Issue 32", function () {

	it("Example from GitHub issue #32", function () {
		var subSchema = {
			"title": "SubSchema",
			"type": "object",
			"properties": {
				"attribute": {"type": "string"}
			},
			"additionalProperties": false
		};

		var mySchema = {
			"title": "My Schema",
			"type": "object",
			"properties": {
				"name": {"type": "string"},
				"subschemas": {"type": "array", "items": {"$ref": "#/definitions/subSchema"}}
			},
			"definitions": {
				"subSchema": subSchema
			},
			"additionalProperties": false
		};

		/* unused variable
		var data1 = {
			"name": "Joe",
			"subschemas": [
				{"attribute": "Hello"}
			]
		};*/

		var addlPropInSubSchema = {
			"name": "Joe",
			"subschemas": [
				{"attribute": "Hello", "extra": "Not Allowed"}
			]
		};

		// Usage 1
		var expectedUsage1Result = tv4.validate(addlPropInSubSchema, mySchema);
		assert.isFalse(expectedUsage1Result, 'plain validate should fail');
		//this.assert(!expectedUsage1Result, 'plain validate should fail');

		// Usage 2
		var expectedUsage2Result = tv4.validateResult(addlPropInSubSchema, mySchema);
		assert.isFalse(expectedUsage2Result.valid, 'validateResult should fail');

		//-> this has a typo that didn't show because of type conversion!

		//this.assert(!expectedUsage1Result.valud, 'validateResult should fail');

		// Usage 3
		var expectedMultipleErrorResult = tv4.validateMultiple(addlPropInSubSchema, mySchema);
		assert.isFalse(expectedMultipleErrorResult.valid, 'validateMultiple should fail');
		assert.length(expectedMultipleErrorResult.errors, 1, 'validateMultiple should have exactly one error');
		//this.assert(!expectedMultipleErrorResult.valid, 'validateMultiple should fail');
		//this.assert(expectedMultipleErrorResult.errors.length == 1, 'validateMultiple should have exactly one error');
	});
});
describe("Issue 67", function () {

	it("Example from GitHub issue #67", function () {
		// Make sure null values don't trip up the normalisation
		tv4.validate(null, {default: null});
	});
});
describe("Issue 86", function () {

	it("Example from GitHub issue #86", function () {
		// The "checkRecursive" flag skips some data nodes if it actually needs to check the same data/schema pair twice
	
		var schema = {
			"type": "object",
			"properties": {
				"shape": {
					"oneOf": [
						{ "$ref": "#/definitions/squareSchema" },
						{ "$ref": "#/definitions/circleSchema" }
					]
				}
			},
			"definitions": {
				"squareSchema": {
					"type": "object",
					"properties": {
						"thetype": {
							"type": "string",
							"enum": ["square"]
						},
						"colour": {},
						"shade": {},
						"boxname": {
							"type": "string"
						}
					},
					"oneOf": [
						{ "$ref": "#/definitions/colourSchema" },
						{ "$ref": "#/definitions/shadeSchema" }
					],
					"required": ["thetype", "boxname"],
					"additionalProperties": false
				},
				"circleSchema": {
					"type": "object",
					"properties": {
						"thetype": {
							"type": "string",
							"enum": ["circle"]
						},
						"colour": {},
						"shade": {}
					},
					"oneOf": [
						{ "$ref": "#/definitions/colourSchema" },
						{ "$ref": "#/definitions/shadeSchema" }
					],
					"additionalProperties": false
				},
				"colourSchema": {
					"type": "object",
					"properties": {
						"colour": {
							"type": "string"
						},
						"shade": {
							"type": "null"
						}
					}
				},
				"shadeSchema": {
					"type": "object",
					"properties": {
						"shade": {
							"type": "string"
						},
						"colour": {
							"type": "null"
						}
					}
				}
			}
		};

	
		var circle = {
			"shape": {
				"thetype": "circle",
				"shade": "red"
			}
		};
		
		var simpleResult = tv4.validate(circle, schema, true);
		var multipleResult = tv4.validateMultiple(circle, schema, true);
		
		assert.isTrue(simpleResult, 'validate() should return valid');
		assert.isTrue(multipleResult.valid, 'validateMultiple() should return valid');
	});

	it("Second example", function () {
		var schema = {
			"allOf": [
				{
					"oneOf": [
						{"$ref": "#/definitions/option1"},
						{"$ref": "#/definitions/option2"},
					]
				},
				{
					"not": {"$ref": "#/definitions/option2"}
				}
			],
			"definitions": {
				"option1": {
					"allOf": [{"type": "string"}]
				},
				"option2": {
					"allOf": [{"type": "number"}]
				}
			}
		};
		
		var simpleResult = tv4.validate("test", schema, true);
		
		assert.isTrue(simpleResult, "validate() should return valid");
	});
});
//@ sourceMappingURL=all_concat.js.map