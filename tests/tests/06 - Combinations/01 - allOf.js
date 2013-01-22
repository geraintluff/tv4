tests.add("allOf success", function () {
	var data = 10;
	var schema = {
		"allOf": [
			{"type": "integer"},
			{"minimum": 5}
		]
	};
	var valid = tv4.validate(data, schema);
	return valid;
});

tests.add("allOf failure", function () {
	var data = 1;
	var schema = {
		"allOf": [
			{"type": "integer"},
			{"minimum": 5}
		]
	};
	var valid = tv4.validate(data, schema);
	return !valid;
});
