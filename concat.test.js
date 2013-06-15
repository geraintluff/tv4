if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
	// NodeJS
	var tv4 = require('../../..').tv4;
	var chai = require('chai');
	chai.Assertion.includeStack = true;
	var assert = chai.assert;
}
decribe('self test', function(){
	it('imported modules', function(){
		assert.ok(assert, 'assert');
		assert.ok(tv4, 'tv imported');
	});
});describe("Any types", function () {
	describe("type", function () {

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
});

describe("Any types", function () {
	describe("enum", function () {

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
});
