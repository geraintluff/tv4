describe("Combinators 01", function () {

	it("allOf success", function () {
		var data = 10;
		var schema = {
			"allOf": [
				{"type": "integer"},
				{"minimum": 5}
			]
		};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("allOf failure", function () {
		var data = 1;
		var schema = {
			"allOf": [
				{"type": "integer"},
				{"minimum": 5}
			]
		};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});
});
