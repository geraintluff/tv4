tests.add("uniqueItems success", function () {
	var data = [1, true, "1"];
	var schema = {uniqueItems: true};
	var valid = tv4.validate(data, schema);
	return valid;
});

tests.add("uniqueItems failure", function () {
	var data = [1, true, "1", 1];
	var schema = {uniqueItems: true};
	var valid = tv4.validate(data, schema);
	return !valid;
});
