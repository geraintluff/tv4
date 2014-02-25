describe("Register custom keyword", function () {
	it("function called", function () {
		var schema = {
			customKeyword: "A"
		};
		var data = {};
		
		tv4.defineKeyword('customKeyword', function () {
			return "Custom failure";
		});
		
		var result = tv4.validateMultiple(data, schema, false, true);
		assert.isFalse(result.valid, "Must not be valid");
		assert.deepEqual(result.errors[0].message, 'Custom keyword failed: customKeyword (Custom failure)');
	});

	it("custom error code", function () {
		var schema = {
			customKeyword: "A"
		};
		var data = "test test test";
		
		tv4.defineKeyword('customKeyword', function (data, value) {
			return {
				code: 'CUSTOM_KEYWORD_FOO',
				message: {data: data, value: value}
			};
		});
		tv4.defineError('CUSTOM_KEYWORD_FOO', 123456789, "{value}: {data}");
		
		var result = tv4.validateMultiple(data, schema, false, true);
		assert.isFalse(result.valid, "Must not be valid");
		assert.deepEqual(result.errors[0].message, 'A: test test test');
		assert.deepEqual(result.errors[0].code, 123456789);
	});
});
