tests.add("additionalProperties schema success", function () {
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
	var result = tv4.validate(data, schema);
	return result.valid;
});

tests.add("patternProperties schema failure", function () {
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
	var result = tv4.validate(data, schema);
	return !result.valid;
});

tests.add("patternProperties boolean success", function () {
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
	var result = tv4.validate(data, schema);
	return result.valid;
});

tests.add("patternProperties boolean failure", function () {
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
	var result = tv4.validate(data, schema);
	return !result.valid;
});