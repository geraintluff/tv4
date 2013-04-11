tests.add("allOf success", function () {
	var data = 10;
	var schema = {
		"allOf": [
			{"type": "integer"},
			{"minimum": 5}
		]
	};
	var result = tv4.validate(data, schema);
	return result.valid;
});

tests.add("allOf failure", function () {
	var data = 1;
	var schema = {
		"allOf": [
			{"type": "integer"},
			{"minimum": 5}
		]
	};
	var result = tv4.validate(data, schema);
	return !result.valid;
});
