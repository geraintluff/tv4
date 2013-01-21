tests.add("minimum length success", function () {
	var data = {key1:1,key2:2,key3:3};
	var schema = {minProperties: 3};
	var valid = validate(data, schema);
	return valid;
});

tests.add("minimum length failure", function () {
	var data = {key1:1,key2:2,key3:3};
	var schema = {minProperties: 5};
	var valid = validate(data, schema);
	return !valid;
});

tests.add("maximum length success", function () {
	var data = {key1:1,key2:2,key3:3};
	var schema = {maxProperties: 5};
	var valid = validate(data, schema);
	return valid;
});

tests.add("maximum length failure", function () {
	var data = {key1:1,key2:2,key3:3};
	var schema = {maxProperties: 2};
	var valid = validate(data, schema);
	return !valid;
});
