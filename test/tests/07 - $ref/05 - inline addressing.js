describe("$ref 05", function () {

	it("inline addressing for fragments", function () {
		var schema = {
			"type": "array",
			"items": {"$ref": "#test"},
			"testSchema": {
				"id": "#test",
				"type": "boolean"
			}
		};
		var data = [0, false];
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});

	it("don't trust non sub-paths", function () {
		var examplePathBase = "http://example.com/" + Math.random();
		var examplePath = examplePathBase + "/schema";
		var schema = {
			"id": examplePath,
			"type": "array",
			"items": {"$ref": "other-schema"},
			"testSchema": {
				"id": "/other-schema",
				"type": "boolean"
			}
		};
		tv4.addSchema(examplePath, schema);
		var data = [0, false];
		var valid = tv4.validate(data, examplePath);

		assert.lengthOf(tv4.missing, 1, "should have missing schema");
		assert.strictEqual(tv4.missing[0], examplePathBase + "/other-schema", "incorrect schema missing: " + tv4.missing[0]);
		assert.isTrue(valid, "should pass, as remote schema not found");

		//this.assert(tv4.missing.length == 1, "should have missing schema");
		//this.assert(tv4.missing[0] == examplePathBase + "/other-schema", "incorrect schema missing: " + tv4.missing[0]);
		//this.assert(valid, "should pass, as remote schema not found");
	});
});
