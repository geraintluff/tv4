describe("Strings 01", function () {

	it("no length constraints", function () {
		var data = "test";
		var schema = {};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("minimum length success", function () {
		var data = "test";
		var schema = {minLength: 3};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("minimum length failure", function () {
		var data = "test";
		var schema = {minLength: 5};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});

	it("maximum length success", function () {
		var data = "test1234";
		var schema = {maxLength: 10};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("maximum length failure", function () {
		var data = "test1234";
		var schema = {maxLength: 5};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});

	it("check error message", function () {
		var data = "test1234";
		var schema = {maxLength: 5};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
		//return typeof tv4.error.message !== "undefined";
		assert.ok(tv4.error.message);
	});
});
