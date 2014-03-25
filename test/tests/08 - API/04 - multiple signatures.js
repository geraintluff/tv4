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
