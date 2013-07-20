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