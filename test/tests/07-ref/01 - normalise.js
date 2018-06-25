describe("$ref 01", function () {

	it("normalise - untouched immediate $ref", function () {
		var schema = {
			"items": {"$ref": "#"}
		};
		tv4.normSchema(schema);
		assert.propertyVal(schema.items, '$ref', "#");
		//return schema.items['$ref'] == "#";
	});

	it("normalise - id as base", function () {
		var schema = {
			"id": "baseUrl",
			"items": {"$ref": "#"}
		};
		tv4.normSchema(schema);
		assert.propertyVal(schema.items, '$ref', "baseUrl#");
		//return schema.items['$ref'] == "baseUrl#";
	});

	it("normalise - id relative to parent", function () {
		var schema = {
			"id": "http://example.com/schema",
			"items": {
				"id": "otherSchema",
				"items": {
					"$ref": "#"
				}
			}
		};
		tv4.normSchema(schema);
		assert.strictEqual(schema.items.id, "http://example.com/otherSchema", "schema.items.id");
		assert.strictEqual(schema.items.items['$ref'], "http://example.com/otherSchema#", "$ref");
		//this.assert(schema.items.id == "http://example.com/otherSchema", "schema.items.id");
		//this.assert(schema.items.items['$ref'] == "http://example.com/otherSchema#", "$ref");
	});

	it("normalise - do not touch contents of \"enum\"", function () {
		var schema = {
			"id": "http://example.com/schema",
			"items": {
				"id": "otherSchema",
				"enum": [
					{
						"$ref": "#"
					}
				]
			}
		};
		tv4.normSchema(schema);
		assert.strictEqual(schema.items['enum'][0]['$ref'], "#");
		//this.assert(schema.items['enum'][0]['$ref'] == "#");
	});

	it("Only normalise id and $ref if they are strings", function () {
		var schema = {
			"properties": {
				"id": {"type": "integer"},
				"$ref": {"type": "integer"}
			}
		};
		var data = {"id": "test", "$ref": "test"};
		tv4.normSchema(schema);
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});
});
