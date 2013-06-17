describe("Any types 01", function () {

	it("no type specified", function () {
		var data = {};
		var schema = {};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("must be object, is object", function () {
		var data = {};
		var schema = {"type": "object"};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("must be object or string, is object", function () {
		var data = {};
		var schema = {"type": ["object", "string"]};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("must be object or string, is array", function () {
		var data = [];
		var schema = {"type": ["object", "string"]};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});

	it("must be array, is object", function () {
		var data = {};
		var schema = {"type": ["array"]};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});

	it("must be string, is integer", function () {
		var data = 5;
		var schema = {"type": ["string"]};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});

	it("must be object, is null", function () {
		var data = null;
		var schema = {"type": ["object"]};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});

	it("must be null, is null", function () {
		var data = null;
		var schema = {"type": "null"};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});
});
