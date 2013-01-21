tests.add("properties success", function () {
	var data = {intKey: 1, stringKey: "one"};
	var schema = {
		properties: {
			intKey: {"type": "integer"},
			stringKey: {"type": "string"}
		}
	};
	var valid = validate(data, schema);
	return valid;
});

tests.add("properties failure", function () {
	var data = {intKey: 1, stringKey: false};
	var schema = {
		properties: {
			intKey: {"type": "integer"},
			stringKey: {"type": "string"}
		}
	};
	var valid = validate(data, schema);
	return !valid;
});
