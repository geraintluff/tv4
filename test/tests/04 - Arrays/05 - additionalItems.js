describe("Arrays 05", function () {

	it("additional items schema success", function () {
		var data = [1, true, "one", "uno"];
		var schema = {
			"items": [
				{"type": "integer"},
				{"type": "boolean"}
			],
			"additionalItems": {"type": "string"}
		};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("additional items schema failure", function () {
		var data = [1, true, "one", 1];
		var schema = {
			"items": [
				{"type": "integer"},
				{"type": "boolean"}
			],
			"additionalItems": {"type": "string"}
		};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});

	it("additional items boolean success", function () {
		var data = [1, true, "one", "uno"];
		var schema = {
			"items": [
				{"type": "integer"},
				{"type": "boolean"}
			],
			"additionalItems": true
		};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("additional items boolean failure", function () {
		var data = [1, true, "one", "uno"];
		var schema = {
			"items": [
				{"type": "integer"},
				{"type": "boolean"}
			],
			"additionalItems": false
		};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});
});
