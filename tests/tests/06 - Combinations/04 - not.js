tests.add("not success", function () {
	var data = 5;
	var schema = {
		"not": {"type": "string"}
	};
	var result = tv4.validate(data, schema);
	return result.valid;
});

tests.add("not failure", function () {
	var data = "test";
	var schema = {
		"not": {"type": "string"}
	};
	var result = tv4.validate(data, schema);
	return !result.valid;
});
