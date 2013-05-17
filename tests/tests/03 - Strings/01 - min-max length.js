tests.add("no length constraints", function () {
	var data = "test";
	var schema = {};
	var valid = tv4.validate(data, schema);
	return valid;
});

tests.add("minimum length success", function () {
	var data = "test";
	var schema = {minLength: 3};
	var valid = tv4.validate(data, schema);
	return valid;
});

tests.add("minimum length failure", function () {
	var data = "test";
	var schema = {minLength: 5};
	var valid = tv4.validate(data, schema);
	return !valid;
});

tests.add("maximum length success", function () {
	var data = "test1234";
	var schema = {maxLength: 10};
	var valid = tv4.validate(data, schema);
	return valid;
});

tests.add("maximum length failure", function () {
	var data = "test1234";
	var schema = {maxLength: 5};
	var valid = tv4.validate(data, schema);
	return !valid;
});

tests.add("check error message", function () {
	var data = "test1234";
	var schema = {maxLength: 5};
	var valid = tv4.validate(data, schema);
	return typeof tv4.error.message !== "undefined";
});
