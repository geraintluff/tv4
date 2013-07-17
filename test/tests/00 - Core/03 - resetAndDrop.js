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
