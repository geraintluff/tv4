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
	var result = tv4.validate(data, schema);
	return !result.valid;
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
	var result = tv4.validate(data, examplePath);
	this.assert(result.missing.length == 1, "should have missing schema");
	this.assert(result.missing[0] == examplePathBase + "/other-schema", "incorrect schema missing: " + result.missing[0]);
	this.assert(result.valid, "should pass, as remote schema not found");
	return true;
});
