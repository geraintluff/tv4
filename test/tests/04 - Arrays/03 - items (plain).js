describe("Arrays 03", function () {

	it("plain items success", function () {
		var data = [1, 2, 3, 4];
		var schema = {
			"items": {
				"type": "integer"
			}
		};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("plain items failure", function () {
		var data = [1, 2, true, 3];
		var schema = {
			"items": {
				"type": "integer"
			}
		};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});
});
