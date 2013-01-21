tests.add("not success", function () {
	var data = 5;
	var schema = {
		"not": {"type": "string"}
	};
	var valid = validate(data, schema);
	return valid;
});

tests.add("not failure", function () {
	var data = "test";
	var schema = {
		"not": {"type": "string"}
	};
	var valid = validate(data, schema);
	return !valid;
});
