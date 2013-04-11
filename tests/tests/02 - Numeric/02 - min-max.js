tests.add("minimum success", function () {
	var data = 5;
	var schema = {minimum: 2.5};
	var result = tv4.validate(data, schema);
	return result.valid;
});

tests.add("minimum failure", function () {
	var data = 5;
	var schema = {minimum: 7};
	var result = tv4.validate(data, schema);
	return !result.valid;
});

tests.add("minimum equality success", function () {
	var data = 5;
	var schema = {minimum: 5};
	var result = tv4.validate(data, schema);
	return result.valid;
});

tests.add("minimum equality failure", function () {
	var data = 5;
	var schema = {minimum: 5, exclusiveMinimum: true};
	var result = tv4.validate(data, schema);
	return !result.valid;
});

tests.add("maximum success", function () {
	var data = 5;
	var schema = {maximum: 7};
	var result = tv4.validate(data, schema);
	return result.valid;
});

tests.add("maximum failure", function () {
	var data = -5;
	var schema = {maximum: -10};
	var result = tv4.validate(data, schema);
	return !result.valid;
});

tests.add("maximum equality success", function () {
	var data = 5;
	var schema = {maximum: 5};
	var result = tv4.validate(data, schema);
	return result.valid;
});

tests.add("maximum equality failure", function () {
	var data = 5;
	var schema = {maximum: 5, exclusiveMaximum: true};
	var result = tv4.validate(data, schema);
	return !result.valid;
});
