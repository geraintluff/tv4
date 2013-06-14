describe("Objects 04", function () {

	it("patternProperties success", function () {
		var data = {intKey: 1, intKey2: 5};
		var schema = {
			properties: {
				intKey: {"type": "integer"}
			},
			patternProperties: {
				"^int": {minimum: 0}
			}
		};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("patternProperties failure 1", function () {
		var data = {intKey: 1, intKey2: 5};
		var schema = {
			properties: {
				intKey: {minimum: 5}
			},
			patternProperties: {
				"^int": {"type": "integer"}
			}
		};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});

	it("patternProperties failure 2", function () {
		var data = {intKey: 10, intKey2: "string value"};
		var schema = {
			properties: {
				intKey: {minimum: 5}
			},
			patternProperties: {
				"^int": {"type": "integer"}
			}
		};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});
});
