describe("Combinators 02", function () {

	it("anyOf success", function () {
		var data = "hello";
		var schema = {
			"anyOf": [
				{"type": "integer"},
				{"type": "string"},
				{"minLength": 1}
			]
		};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("anyOf success with banUnknownProperties", function () {
		var data = {
			test: "hello"
		};
		var schema = {
			"anyOf": [
				{
					properties: {
						test: {"type": "string"}
					}
				},
				{
					properties: {
						test: {"type": "integer"}
					}
				}
			]
		};
		var valid = tv4.validateMultiple(data, schema, false, true).valid;
		assert.isTrue(valid);
	});

	it("anyOf failure", function () {
		var data = true;
		var schema = {
			"anyOf": [
				{"type": "integer"},
				{"type": "string"}
			]
		};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});

});
