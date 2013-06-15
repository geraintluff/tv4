describe("$ref 03", function () {

	it("addSchema(), getSchema()", function () {
		var url = "http://example.com/schema" + Math.random();
		var schema = {
			"test": "value"
		};
		tv4.addSchema(url, schema);
		var fetched = tv4.getSchema(url);
		assert.strictEqual(fetched.test, "value");
		//return fetched.test == "value";
	});

	it("addSchema(), getSchema() with blank fragment", function () {
		var url = "http://example.com/schema" + Math.random();
		var schema = {
			"test": "value"
		};
		tv4.addSchema(url, schema);
		var fetched = tv4.getSchema(url + "#");
		assert.strictEqual(fetched.test, "value");
		//return fetched.test == "value";
	});

	it("addSchema(), getSchema() with pointer path fragment", function () {
		var url = "http://example.com/schema" + Math.random();
		var schema = {
			"items": {
				"properties": {
					"key[]": {
						"inner/key~": "value"
					}
				}
			}
		};
		tv4.addSchema(url, schema);
		var fetched = tv4.getSchema(url + "#/items/properties/key%5B%5D/inner~1key~0");
		assert.strictEqual(fetched, "value");
		//return fetched == "value";
	});
});