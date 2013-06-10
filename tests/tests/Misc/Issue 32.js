tests.add("Example from GitHub issue #32", function () {
	var subSchema = {
		"title": "SubSchema",
		"type": "object",
		"properties": {
			"attribute": {"type": "string"}
		},
		"additionalProperties": false
	};

	var mySchema = {
		"title": "My Schema",
		"type": "object",
		"properties": {
			"name": {"type": "string"},
			"subschemas": {"type": "array", "items": {"$ref": "#/definitions/subSchema"}}
		},
		"definitions": {
			"subSchema": subSchema
		},
		"additionalProperties": false
	};

	var data1 = {
		"name": "Joe",
		"subschemas": [{"attribute": "Hello"}]
	};

	var addlPropInSubSchema = {
		"name": "Joe",
		"subschemas": [{"attribute": "Hello", "extra": "Not Allowed"}]
	};

	// Usage 1
	var expectedUsage1Result = tv4.validate(addlPropInSubSchema, mySchema);
	this.assert(!expectedUsage1Result, 'plain validate should fail');

	// Usage 1
	var expectedUsage1Result = tv4.validateResult(addlPropInSubSchema, mySchema);
	this.assert(!expectedUsage1Result.valud, 'validateResult should fail');

	// Usage 3
	var expectedMultipleErrorResult = tv4.validateMultiple(addlPropInSubSchema, mySchema);
	this.assert(!expectedMultipleErrorResult.valid, 'validateMultiple should fail');
	this.assert(expectedMultipleErrorResult.errors.length == 1, 'validateMultiple should have exactly one error');
	console.log(expectedMultipleErrorResult.errors);
	return true;
});