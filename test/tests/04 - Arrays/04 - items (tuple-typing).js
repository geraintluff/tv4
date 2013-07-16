describe("Arrays 04", function () {

	it("plain items success", function () {
		var data = [1, true, "one"];
		var schema = {
			"items": [
				{"type": "integer"},
				{"type": "boolean"}
			]
		};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("plain items failure", function () {
		var data = [1, null, "one"];
		var schema = {
			"items": [
				{"type": "integer"},
				{"type": "boolean"}
			]
		};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});
});
