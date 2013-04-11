tests.add("oneOf success", function () {
	var data = 5;
	var schema = {
		"oneOf": [
			{"type": "integer"},
			{"type": "string"},
			{"type": "string", minLength: 1}
		]
	};
	var result = tv4.validate(data, schema);
	return result.valid;
});

tests.add("oneOf failure (too many)", function () {
	var data = "string";
	var schema = {
		"oneOf": [
			{"type": "integer"},
			{"type": "string"},
			{"minLength": 1}
		]
	};
	var result = tv4.validate(data, schema);
	return !result.valid;
});

tests.add("oneOf failure (no matches)", function () {
	var data = false;
	var schema = {
		"oneOf": [
			{"type": "integer"},
			{"type": "string"},
			{"type": "string", "minLength": 1}
		]
	};
	var result = tv4.validate(data, schema);
	return !result.valid;
});
