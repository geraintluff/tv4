tests.add("plain items success", function () {
	var data = [1, 2, 3, 4];
	var schema = {
		"items": {
			"type": "integer"
		}
	};
	var valid = validate(data, schema);
	return valid;
});

tests.add("plain items failure", function () {
	var data = [1, 2, true, 3];
	var schema = {
		"items": {
			"type": "integer"
		}
	};
	var valid = validate(data, schema);
	return !valid;
});
