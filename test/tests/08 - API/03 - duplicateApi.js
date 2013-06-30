describe("API 02", function () {

	it("tv4.duplicateApi() produces working copy", function () {
		var duplicate = tv4.duplicateApi();
		assert.isObject(duplicate);
		// Basic sanity checks
		assert.isTrue(duplicate.validate({}, {type: "object"}));
		assert.isObject(duplicate.validateMultiple("string", {}));
	});

	it("tv4.duplicateApi() has separate schema store", function () {
		var duplicate = tv4.duplicateApi();
		
		var schemaUrl = "http://example.com/schema" + Math.random();
		duplicate.addSchema(schemaUrl, {});
		
		assert.isObject(duplicate.getSchema(schemaUrl));
		assert.isUndefined(tv4.getSchema(schemaUrl));
	});
});
