describe("$ref 04", function () {

	it("addSchema(), $ref", function () {
		var url = "http://example.com/schema";
		var schema = {
			"test": "value"
		};
		tv4.addSchema(url, schema);

		var otherSchema = {
			"items": {"$ref": url}
		};
		var valid = tv4.validate([0,1,2,3], otherSchema);

		assert.isTrue(valid, "should be valid");
		assert.length(tv4.missing, 0, "should have no missing schemas");

		//this.assert(valid, "should be valid");
		//this.assert(tv4.missing.length == 0, "should have no missing schemas");
	});

	it("internal $ref", function () {
		var schema = {
			"type": "array",
			"items": {"$ref": "#"}
		};

		assert.isTrue(tv4.validate([[],[[]]], schema), "List of lists should be valid");
		assert.isTrue(!tv4.validate([0,1,2,3], schema), "List of ints should not");
		assert.isTrue(!tv4.validate([[true], []], schema), "List of list with boolean should not");

		assert.length(tv4.missing, 0, "should have no missing schemas");

		//this.assert(tv4.validate([[],[[]]], schema), "List of lists should be valid");
		//this.assert(!tv4.validate([0,1,2,3], schema), "List of ints should not");
		//this.assert(!tv4.validate([[true], []], schema), "List of list with boolean should not");

		//this.assert(tv4.missing.length == 0, "should have no missing schemas");
	});

		it("internal $ref unreachable schema uri", function () {
		var schema = {
			"id": "https://not-connected-to-the-internet.com/schema.json#",
			"$schema": "https://not-connected-to-the-internet/v1/schema#",
			"title": "This is a schema",
			"type": "object",
			"additionalProperties": false,
			"properties": {
				"refd": {
					"$ref": '#/definitions/refd'
				}
			}, "definitions": {
				"refd": {
					"additionalProperties": false,
					"type": "object",
					"required": ["value"],
					"properties": {
						"value": {
							"type": "string"
						}
					}
				}
			}
		};
		var invalid = { refd: { value: 1 } };
		var valid = { refd: { value: "string" } };

		assert.isTrue(!tv4.validate(invalid, schema), "Should not validate");
		assert.isTrue(tv4.validate(valid, schema), "Should valid");

		assert.length(tv4.missing, 0, "should have no missing schemas");
	});
});
