tests.add("pattern success", function () {
	var data = "9test";
	var schema = {"pattern": "^[0-9][a-zA-Z]*$"};
	var result = tv4.validate(data, schema);
	return result.valid;
});

tests.add("pattern failure", function () {
	var data = "9test9";
	var schema = {"pattern": "^[0-9][a-zA-Z]*$"};
	var result = tv4.validate(data, schema);
	return !result.valid;
});