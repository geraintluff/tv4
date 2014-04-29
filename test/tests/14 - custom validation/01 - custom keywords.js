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
		assert.deepEqual(result.errors[0].message, 'Keyword failed: customKeyword (Custom failure)');
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
	
	it("restrict custom error codes", function () {
		assert.throws(function () {
			tv4.defineError('CUSTOM_KEYWORD_BLAH', 9999, "{value}: {data}");
		});
	});
	
	it("restrict custom error names", function () {
		assert.throws(function () {
			tv4.defineError('doesnotmatchpattern', 10002, "{value}: {data}");
		});
	});
	
	it("can't defined the same code twice", function () {
		assert.throws(function () {
			tv4.defineError('CUSTOM_ONE', 10005, "{value}: {data}");
			tv4.defineError('CUSTOM_TWO', 10005, "{value}: {data}");
		});
	});
	
	it("function only called when keyword present", function () {
		var schema = {
			"type": "object",
			"properties": {
				"aStringValue": {
					"type": "string",
					"my-custom-keyword": "something"
				},
				"aBooleanValue": {
					"type": "boolean"
				}
			}
		};
		var data = {
			"aStringValue": "a string",
			"aBooleanValue": true
		};
		
		var callCount = 0;
		tv4.defineKeyword('my-custom-keyword', function () {
			callCount++;
		});
		
		tv4.validateMultiple(data, schema, false, true);
		assert.deepEqual(callCount, 1, "custom function must be called exactly once");
	});
});
