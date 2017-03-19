describe("Enum object/null failure", function () {

	it("Doesn't crash", function () {
	
		var schema = {
			"type": "object",
			"required": ["value"],
			"properties": {
				"key": {
					"type": "string"
				},
				"value": {
					"enum": [6, "foo", [], true, {"foo": 12}]
				}
			}
		};

		var data = {key: "test", value: null}; // Somehow this is only a problem when a *property* is null, not the root
		var result = tv4.validateMultiple(data, schema);
		assert.isFalse(result.valid, 'validateMultiple() should return invalid');

		data = {key: "test"}; // Undefined required property.
		result = tv4.validateMultiple(data, schema);
		assert.isFalse(result.valid, 'validateMultiple() should return invalid');
	});
});