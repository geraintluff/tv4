describe("Objects 08", function () {

	// used by multiple tests
	var data = {"stringKey": "string value"};
	Object.defineProperty(data, "extraKey", {value: "extra value"});
	var schema = {
		properties: {
			"stringKey": {"type": "string"}
		},
		additionalProperties: false
	};

	it("non-enumerable properties are ignored by default", function () {
		var valid = tv4.validateResult(data, schema).valid;
		assert.isTrue(valid);
	});

	it("non-enumerable properties are validated when checkNonEnumerableProperties is true", function () {
		var valid = tv4.validateResult(data, schema, {checkNonEnumerableProperties: true}).valid;
		assert.isFalse(valid);
	});

});
