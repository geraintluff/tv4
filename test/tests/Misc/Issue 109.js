describe("Issue 109", function () {

	it("Don't break on null values with banUnknownProperties", function () {
	
		var schema = {
			"type": "object",
			"properties": {
				"foo": {
					"type": "object",
					"additionalProperties": {"type": "string"}
				}
			}
		};

		var data = {foo: null};
		
		var result = tv4.validateMultiple(data, schema, true, true);
		
		assert.isFalse(result.valid, 'validateMultiple() should return valid');
	});
});