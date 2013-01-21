tests.add("no type specified", function () {
	var data = {};
	var schema = {};
	var valid = validate(data, schema);
	
	return valid;
});

tests.add("must be object, is object", function () {
	var data = {};
	var schema = {"type": "object"};
	var valid = validate(data, schema);
	
	return valid;
});

tests.add("must be object or string, is object", function () {
	var data = {};
	var schema = {"type": ["object", "string"]};
	var valid = validate(data, schema);
	return valid;
});

tests.add("must be object or string, is array", function () {
	var data = [];
	var schema = {"type": ["object", "string"]};
	var valid = validate(data, schema);
	return !valid;
});

tests.add("must be array, is object", function () {
	var data = {};
	var schema = {"type": ["array"]};
	var valid = validate(data, schema);
	return !valid;
});

tests.add("must be string, is integer", function () {
	var data = 5;
	var schema = {"type": ["string"]};
	var valid = validate(data, schema);
	return !valid;
});

tests.add("must be object, is null", function () {
	var data = null;
	var schema = {"type": ["object"]};
	var valid = validate(data, schema);
	return !valid;
});

tests.add("must be null, is null", function () {
	var data = null;
	var schema = {"type": "null"};
	var valid = validate(data, schema);
	return valid;
});