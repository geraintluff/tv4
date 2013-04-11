tests.add("patternProperties success", function () {
	var data = {intKey: 1, intKey2: 5};
	var schema = {
		properties: {
			intKey: {"type": "integer"}
		},
		patternProperties: {
			"^int": {minimum: 0}
		}
	};
	var result = tv4.validate(data, schema);
	return result.valid;
});

tests.add("patternProperties failure 1", function () {
	var data = {intKey: 1, intKey2: 5};
	var schema = {
		properties: {
			intKey: {minimum: 5}
		},
		patternProperties: {
			"^int": {"type": "integer"}
		}
	};
	var result = tv4.validate(data, schema);
	return !result.valid;
});

tests.add("patternProperties failure 2", function () {
	var data = {intKey: 10, intKey2: "string value"};
	var schema = {
		properties: {
			intKey: {minimum: 5}
		},
		patternProperties: {
			"^int": {"type": "integer"}
		}
	};
	var result = tv4.validate(data, schema);
	return !result.valid;
});
