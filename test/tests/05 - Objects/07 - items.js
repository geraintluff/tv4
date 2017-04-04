describe("Objects 07", function () {

	it("dictionary items success", function () {
		var data = {"1":1, "2":2, "3":3, "4":4};
		var schema = {
			"items": {
				"type": "integer"
			}
		};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("dictionary items failure", function () {
		var data = {"1":1, "2":2, "3":true, "4":4};
		var schema = {
			"items": {
				"type": "integer"
			}
		};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});
});