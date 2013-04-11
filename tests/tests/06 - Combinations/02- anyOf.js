tests.add("anyOf success", function () {
	var data = "hello";
	var schema = {
		"anyOf": [
			{"type": "integer"},
			{"type": "string"},
			{"minLength": 1}
		]
	};
	var result = tv4.validate(data, schema);
	return result.valid;
});

tests.add("anyOf failure", function () {
	var data = true;
	var schema = {
		"anyOf": [
			{"type": "integer"},
			{"type": "string"}
		]
	};
	var result = tv4.validate(data, schema);
	return !result.valid;
});
