describe("Combinators 04", function () {

	it("not success", function () {
		var data = 5;
		var schema = {
			"not": {"type": "string"}
		};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("not failure", function () {
		var data = "test";
		var schema = {
			"not": {"type": "string"}
		};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});
});
