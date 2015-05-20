describe("$refs to recursive $refs", function () {
	it("addSchema(), $ref", function () {
		var schema = {
			id: "http://example.com/schema",
			some: {
				other: {type: "number"}
			},
			intermediary: {
				'$ref': '#/some/other'
			},
			data: {'$ref': "#/intermediary"},
		};
		
		tv4.addSchema(schema);
		assert.isTrue(tv4.validate(42, {"$ref": "http://example.com/schema#/data"}), "42 valid");
		//assert.isFalse(tv4.validate(42, {"$ref": "http://example.com/schema#/data"}), "\"42\" invalid");
		
		assert.length(tv4.missing, 0, "should have no missing schemas");
	});

	it("Don't hang on circle", function () {
		var schema = {
			id: "http://example.com/schema",
			intermediary: {'$ref': '#/ref1'},
			ref1: {"$ref": "#/intermediary"}
		};

		tv4.addSchema(schema);
		var result = tv4.validateResult(42, "http://example.com/schema#/ref1");
		assert.isFalse(result.valid, "should be invalid");
		assert.equal(result.error.code, tv4.errorCodes.CIRCULAR_REFERENCE, 'Error code correct');
	});

	it("works right on deeper levels", function () {
		var schema1 = {
			id: "http://a.b/c",
			definitions: {
				"a": {
					"type": "integer"
				}
			}
		};

		var schema2 = {
			id: "http://b.c/d",
			properties: {
				"id": {"$ref": "http://a.b/c#/definitions/a"}
			}
		};

		tv4.addSchema(schema1);
		tv4.addSchema(schema2);
		var result1 = tv4.getSchema("http://b.c/d#/properties/id", null, 5);
		assert.equal(result1.type, "integer");

		var result2 = tv4.validateResult(42, "http://b.c/d#/properties/id");
		assert.isTrue(result2.valid, "should be valid");

		var result3 = tv4.validateResult("string of text", "http://b.c/d#/properties/id");
		assert.isFalse(result3.valid, "should be invalid");
	});
});
