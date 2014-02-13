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
