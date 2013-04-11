tests.add("plain items success", function () {
	var data = [1, true, "one"];
	var schema = {
		"items": [
			{"type": "integer"},
			{"type": "boolean"}
		]
	};
	var result = tv4.validate(data, schema);
	return result.valid;
});

tests.add("plain items failure", function () {
	var data = [1, null, "one"];
	var schema = {
		"items": [
			{"type": "integer"},
			{"type": "boolean"}
		]
	};
	var result = tv4.validate(data, schema);
	return !result.valid;
});
