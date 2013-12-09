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
