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

	it("should resolve $ref to a nested schema", function () {
		
		var metaSchema = {
			"$schema": "http://json-schema.org/draft-03/schema#",
			"id": "http://json-schema.org/draft-03/schema#",
			"type": "object",
			
			"properties": {
				"type": {
					"type": [ "string", "array" ],
					"items": {
						"type": [ "string", { "$ref": "#" } ]
					},
					"uniqueItems": true,
					"default": "any"
				},
				
				"properties": {
					"type": "object",
					"additionalProperties": { "$ref": "#" },
					"default": {}
				},
				
				"items": {
					"type": [ { "$ref": "#" }, "array" ],
					"items": { "$ref": "#" },
					"default": {}
				},
			}
		};

		var schema = {
			"type": "array",
			"items": {
				"type": "object",
				"properties": {
					"id": {"type": "integer"},
					"value": {"type": "string"}
				}
			}
		};

		var valid = tv4.validate(schema, metaSchema);
		console.log("tv4.error: ", tv4.error);
		assert.isTrue(valid);
	});

});
