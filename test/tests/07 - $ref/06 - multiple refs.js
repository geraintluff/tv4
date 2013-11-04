describe("$refs to $refs", function () {
	it("addSchema(), $ref", function () {
		var schema = {
			id: "http://example.com/schema",
			some: {
				other: {type: "number"}
			},
			data: {'$ref': "#/some/other"}
		};
		
		tv4.addSchema(schema);
		assert.isTrue(tv4.validate(42, {"$ref": "http://example.com/schema#/data"}), "42 valid");
		//assert.isFalse(tv4.validate(42, {"$ref": "http://example.com/schema#/data"}), "\"42\" invalid");
		
		assert.length(tv4.missing, 0, "should have no missing schemas");
	});

	it("Don't hang on circle", function () {
		var schema = {
			id: "http://example.com/schema",
			ref1: {"$ref": "#/ref2"},
			ref2: {"$ref": "#/ref1"}
		};
		
		tv4.addSchema(schema);
		var result = tv4.validateResult(42, "http://example.com/schema#/ref1");
		
		assert.isFalse(result.valid, "not valid");
		assert.equal(result.error.code, tv4.errorCodes.CIRCULAR_REFERENCE, 'Error code correct');
	});
});
