tests.add("no length constraints", function () {
	var data = "test";
	var schema = {};
	var result = tv4.validate(data, schema);
	return result.valid;
});

tests.add("minimum length success", function () {
	var data = "test";
	var schema = {minLength: 3};
	var result = tv4.validate(data, schema);
	return result.valid;
});

tests.add("minimum length failure", function () {
	var data = "test";
	var schema = {minLength: 5};
	var result = tv4.validate(data, schema);
	return !result.valid;
});

tests.add("maximum length success", function () {
	var data = "test1234";
	var schema = {maxLength: 10};
	var result = tv4.validate(data, schema);
	return result.valid;
});

tests.add("maximum length failure", function () {
	var data = "test1234";
	var schema = {maxLength: 5};
	var result = tv4.validate(data, schema);
	return !result.valid;
});
