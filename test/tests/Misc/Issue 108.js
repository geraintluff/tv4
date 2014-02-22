describe("Issue 108", function () {

	it("Normalise schemas even inside $ref", function () {
	
		var schema = {
			"id": "http://example.com/schema" + Math.random(),
			"$ref": "#whatever",
			"properties": {
				"foo": {
					"id": "#test",
					"type": "string"
				}
			}
		};

		tv4.addSchema(schema);

		var result = tv4.validateMultiple("test data", schema.id + '#test');		
		assert.isTrue(result.valid, 'validateMultiple() should return valid');
		assert.deepEqual(result.missing.length, 0, 'should have no missing schemas');

		var result2 = tv4.validateMultiple({"foo":"bar"}, schema.id + '#test');
		assert.isFalse(result2.valid, 'validateMultiple() should return invalid');
		assert.deepEqual(result2.missing.length, 0, 'should have no missing schemas');
	});
});