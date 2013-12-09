describe("Ban unknown properties 02", function () {
	it("Do not track property definitions from \"not\"", function () {
		var schema = {
			"not": {
				properties: {
					propA: {"type": "string"},
				}
			}
		};
		var data = {
			propA: true,
		};
		
		var result = tv4.validateMultiple(data, schema, false, true);
		assert.isFalse(result.valid, "Must not be valid");
	});

	it("Do not track property definitions from unselected \"oneOf\"", function () {
		var schema = {
			"oneOf": [
				{
					"type": "object",
					"properties": {
						"propA": {"type": "string"}
					}
				},
				{
					"type": "object",
					"properties": {
						"propB": {"type": "boolean"}
					}
				}
			]
		};
		var data = {
			propA: true,
			propB: true
		};
		
		var result = tv4.validateMultiple(data, schema, false, true);
		assert.isFalse(result.valid, "Must not be valid");

		var result2 = tv4.validateMultiple(data, schema, false);
		assert.isTrue(result2.valid, "Must still be valid without flag");
	});


	it("Do not track property definitions from unselected \"anyOf\"", function () {
		var schema = {
			"anyOf": [
				{
					"type": "object",
					"properties": {
						"propA": {"type": "string"}
					}
				},
				{
					"type": "object",
					"properties": {
						"propB": {"type": "boolean"}
					}
				}
			]
		};
		var data = {
			propA: true,
			propB: true
		};
		
		var result = tv4.validateMultiple(data, schema, false, true);
		assert.isFalse(result.valid, "Must not be valid");

		var result2 = tv4.validateMultiple(data, schema, false);
		assert.isTrue(result2.valid, "Must still be valid without flag");
	});
});
