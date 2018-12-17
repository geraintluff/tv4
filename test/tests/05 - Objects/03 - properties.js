describe("Objects 03", function () {

	it("properties success", function () {
		var data = {intKey: 1, stringKey: "one"};
		var schema = {
			properties: {
				intKey: {"type": "integer"},
				stringKey: {"type": "string"}
			}
		};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("properties failure", function () {
		var data = {intKey: 1, stringKey: false};
		var schema = {
			properties: {
				intKey: {"type": "integer"},
				stringKey: {"type": "string"}
			}
		};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});

	it("undefined key success", function () {
		var data = {undefinedKey: undefined};
		var schema = {
			properties: {
				undefinedKey: {"type": "integer"}
			}
		};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

});
