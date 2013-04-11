tests.add("plain items success", function () {
	var data = [1, 2, 3, 4];
	var schema = {
		"items": {
			"type": "integer"
		}
	};
	var result = tv4.validate(data, schema);
	return result.valid;
});

tests.add("plain items failure", function () {
	var data = [1, 2, true, 3];
	var schema = {
		"items": {
			"type": "integer"
		}
	};
	var result = tv4.validate(data, schema);
	return !result.valid;
});
