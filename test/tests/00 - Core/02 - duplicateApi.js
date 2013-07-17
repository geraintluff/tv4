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
