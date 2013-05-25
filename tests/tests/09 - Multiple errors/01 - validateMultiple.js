tests.add("validateMultiple returns array of errors", function () {
	var data = {};
	var schema = {"type": "array"};
	var result = tv4.validateMultiple(data, schema);

	this.assert(result.valid == false, "data should not be valid");
	this.assert(typeof result.errors == "object" && typeof result.errors.length == "number", "result.errors must be array-like");
	return true;
});

tests.add("validateMultiple has multiple entries", function () {
	var data = {"a": 1, "b": 2};
	var schema = {"additionalProperties": {"type": "string"}};
	var result = tv4.validateMultiple(data, schema);

	this.assert(result.errors.length == 2, "should return two errors");
	return true;
});

tests.add("validateMultiple correctly fails anyOf", function () {
	var data = {};
	var schema = {
		"anyOf": [
			{"type": "string"},
			{"type": "integer"}
		]
	};
	var result = tv4.validateMultiple(data, schema);

	this.assert(result.valid == false, "should not validate");
	this.assert(result.errors.length == 1, "should list one error");
	return true;
});

tests.add("validateMultiple correctly fails not", function () {
	var data = {};
	var schema = {
		"not": {"type": "object"}
	};
	var result = tv4.validateMultiple(data, schema);

	this.assert(result.valid == false, "should not validate");
	this.assert(result.errors.length == 1, "should list one error");
	return true;
});

tests.add("validateMultiple correctly passes not", function () {
	var data = {};
	var schema = {
		"not": {"type": "string"}
	};
	var result = tv4.validateMultiple(data, schema);

	this.assert(result.valid == true, "should validate");
	this.assert(result.errors.length == 0, "no errors");
	return true;
});

tests.add("validateMultiple correctly fails multiple oneOf", function () {
	var data = 5;
	var schema = {
		"oneOf": [
			{"type": "integer"},
			{"type": "number"}
		]
	};
	var result = tv4.validateMultiple(data, schema);

	this.assert(result.valid == false, "should not validate");
	this.assert(result.errors.length == 1, "only one error");
	return true;
});