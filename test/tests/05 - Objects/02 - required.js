describe("Objects 02", function () {

	it("required success", function () {
		var data = {key1: 1, key2: 2, key3: 3};
		var schema = {required: ["key1", "key2"]};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("required failure", function () {
		var data = {key1: 1, key2: 2, key3: 3};
		var schema = {required: ["key1", "notDefined"]};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});
});
