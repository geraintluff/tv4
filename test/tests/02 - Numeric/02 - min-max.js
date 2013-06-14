describe("Numberic 02", function () {

	it("minimum success", function () {
		var data = 5;
		var schema = {minimum: 2.5};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("minimum failure", function () {
		var data = 5;
		var schema = {minimum: 7};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});

	it("minimum equality success", function () {
		var data = 5;
		var schema = {minimum: 5};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("minimum equality failure", function () {
		var data = 5;
		var schema = {minimum: 5, exclusiveMinimum: true};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});

	it("maximum success", function () {
		var data = 5;
		var schema = {maximum: 7};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("maximum failure", function () {
		var data = -5;
		var schema = {maximum: -10};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});

	it("maximum equality success", function () {
		var data = 5;
		var schema = {maximum: 5};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("maximum equality failure", function () {
		var data = 5;
		var schema = {maximum: 5, exclusiveMaximum: true};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});
});
