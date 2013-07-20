describe("Objects 05", function () {

	it("additionalProperties schema success", function () {
		var data = {intKey: 1, intKey2: 5, stringKey: "string"};
		var schema = {
			properties: {
				intKey: {"type": "integer"}
			},
			patternProperties: {
				"^int": {minimum: 0}
			},
			additionalProperties: {"type": "string"}
		};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("patternProperties schema failure", function () {
		var data = {intKey: 10, intKey2: 5, stringKey: null};
		var schema = {
			properties: {
				intKey: {minimum: 5}
			},
			patternProperties: {
				"^int": {"type": "integer"}
			},
			additionalProperties: {"type": "string"}
		};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});

	it("patternProperties boolean success", function () {
		var data = {intKey: 10, intKey2: 5, stringKey: null};
		var schema = {
			properties: {
				intKey: {minimum: 5}
			},
			patternProperties: {
				"^int": {"type": "integer"}
			},
			additionalProperties: true
		};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("patternProperties boolean failure", function () {
		var data = {intKey: 10, intKey2: 5, stringKey: null};
		var schema = {
			properties: {
				intKey: {minimum: 5}
			},
			patternProperties: {
				"^int": {"type": "integer"}
			},
			additionalProperties: false
		};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});
});