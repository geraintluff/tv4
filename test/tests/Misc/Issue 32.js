describe("Issue 32", function () {

	it("Example from GitHub issue #32", function () {
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

		/* unused variable
		var data1 = {
			"name": "Joe",
			"subschemas": [
				{"attribute": "Hello"}
			]
		};*/

		var addlPropInSubSchema = {
			"name": "Joe",
			"subschemas": [
				{"attribute": "Hello", "extra": "Not Allowed"}
			]
		};

		// Usage 1
		var expectedUsage1Result = tv4.validate(addlPropInSubSchema, mySchema);
		assert.isFalse(expectedUsage1Result, 'plain validate should fail');
		//this.assert(!expectedUsage1Result, 'plain validate should fail');

		// Usage 2
		var expectedUsage2Result = tv4.validateResult(addlPropInSubSchema, mySchema);
		assert.isFalse(expectedUsage2Result.valid, 'validateResult should fail');

		//-> this has a typo that didn't show because of type conversion!

		//this.assert(!expectedUsage1Result.valud, 'validateResult should fail');

		// Usage 3
		var expectedMultipleErrorResult = tv4.validateMultiple(addlPropInSubSchema, mySchema);
		assert.isFalse(expectedMultipleErrorResult.valid, 'validateMultiple should fail');
		assert.length(expectedMultipleErrorResult.errors, 1, 'validateMultiple should have exactly one error');
		//this.assert(!expectedMultipleErrorResult.valid, 'validateMultiple should fail');
		//this.assert(expectedMultipleErrorResult.errors.length == 1, 'validateMultiple should have exactly one error');
	});
});