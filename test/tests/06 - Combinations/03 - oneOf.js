describe("Combinators 03", function () {

	it("oneOf success", function () {
		var data = 5;
		var schema = {
			"oneOf": [
				{"type": "integer"},
				{"type": "string"},
				{"type": "string", minLength: 1}
			]
		};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("oneOf failure (too many)", function () {
		var data = "string";
		var schema = {
			"oneOf": [
				{"type": "integer"},
				{"type": "string"},
				{"minLength": 1}
			]
		};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});

	it("oneOf failure (no matches)", function () {
		var data = false;
		var schema = {
			"oneOf": [
				{"type": "integer"},
				{"type": "string"},
				{"type": "string", "minLength": 1}
			]
		};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});
});
