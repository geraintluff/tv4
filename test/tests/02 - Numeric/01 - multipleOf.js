describe("Numberic 01", function () {

	it("multipleOf", function () {
		var data = 5;
		var schema = {"multipleOf": 2.5};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("multipleOf failure", function () {
		var data = 5;
		var schema = {"multipleOf": 0.75};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});
});