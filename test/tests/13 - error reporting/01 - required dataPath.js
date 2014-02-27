describe("Fill dataPath for \"required\" (GitHub Issue #103)", function () {
	it("Blank for first-level properties", function () {
		var schema = {
			required: ['A']
		};
		var data = {};
		
		var result = tv4.validateMultiple(data, schema, false, true);
		assert.isFalse(result.valid, "Must not be valid");
		assert.deepEqual(result.errors[0].dataPath, '');
	});

	it("Filled for second-level properties", function () {
		var schema = {
			properties: {
				"foo": {
					required: ["bar"]
				}
			}
		};
		var data = {"foo": {}};
		
		var result = tv4.validateMultiple(data, schema, false, true);
		assert.isFalse(result.valid, "Must not be valid");
		assert.deepEqual(result.errors[0].dataPath, '/foo');
	});
});
