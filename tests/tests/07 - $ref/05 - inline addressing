tests.add("inline addressing for fragments", function () {
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
	return !valid;
});

tests.add("don't trust non sub-paths", function () {
	var examplePathBase = "http://example.com/" + Math.random();
	var examplePath = examplePathBase +"/schema";
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
	this.assert(tv4.missing.length == 1, "should have missing schema");
	this.assert(tv4.missing[0] == examplePathBase + "/other-schema", "incorrect schema missing: " + tv4.missing[0]);
	this.assert(valid, "should pass, as remote schema not found");
	return true;
});
