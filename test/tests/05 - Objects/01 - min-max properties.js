describe("Objects 01", function () {

	it("minimum length success", function () {
		var data = {key1: 1, key2: 2, key3: 3};
		var schema = {minProperties: 3};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("minimum length failure", function () {
		var data = {key1: 1, key2: 2, key3: 3};
		var schema = {minProperties: 5};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});

	it("maximum length success", function () {
		var data = {key1: 1, key2: 2, key3: 3};
		var schema = {maxProperties: 5};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("maximum length failure", function () {
		var data = {key1: 1, key2: 2, key3: 3};
		var schema = {maxProperties: 2};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});
});
