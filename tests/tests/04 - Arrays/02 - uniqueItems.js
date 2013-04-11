tests.add("uniqueItems success", function () {
	var data = [1, true, "1"];
	var schema = {uniqueItems: true};
	var result = tv4.validate(data, schema);
	return result.valid;
});

tests.add("uniqueItems failure", function () {
	var data = [1, true, "1", 1];
	var schema = {uniqueItems: true};
	var result = tv4.validate(data, schema);
	return !result.valid;
});
