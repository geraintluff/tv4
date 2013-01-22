tests.add("normalise - untouched immediate $ref", function () {
	var schema = {
		"items": {"$ref": "#"}
	};
	tv4.normSchema(schema);
	return schema.items['$ref'] == "#";
});

tests.add("normalise - id as base", function () {
	var schema = {
		"id": "baseUrl",
		"items": {"$ref": "#"}
	};
	tv4.normSchema(schema);
	return schema.items['$ref'] == "baseUrl#";
});

tests.add("normalise - id relative to parent", function () {
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
	this.assert(schema.items.id == "http://example.com/otherSchema", "schema.items.id");
	this.assert(schema.items.items['$ref'] == "http://example.com/otherSchema#", "$ref");
	return true;
});


tests.add("normalise - do not touch contents of \"enum\"", function () {
	var schema = {
		"id": "http://example.com/schema",
		"items": {
			"id": "otherSchema",
			"enum": [{
				"$ref": "#"
			}]
		}
	};
	tv4.normSchema(schema);
	this.assert(schema.items['enum'][0]['$ref'] == "#");
	return true;
});
