describe("Numeric - multipleOf", function () {

	it("pass", function () {
		var data = 5;
		var schema = {"multipleOf": 2.5};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("fail", function () {
		var data = 5;
		var schema = {"multipleOf": 0.75};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});

	it("floating-point pass 6.6/2.2", function () {
		var data = 6.6;
		var schema = {"multipleOf": 2.2};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("floating-point pass 6.6666/2.2222", function () {
		var data = 6.6666;
		var schema = {"multipleOf": 2.2222};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});
});