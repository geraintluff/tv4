tests.add("additional items schema success", function () {
	var data = [1, true, "one", "uno"];
	var schema = {
		"items": [
			{"type": "integer"},
			{"type": "boolean"}
		],
		"additionalItems": {"type": "string"}
	};
	var valid = validate(data, schema);
	return valid;
});

tests.add("additional items schema failure", function () {
	var data = [1, true, "one", 1];
	var schema = {
		"items": [
			{"type": "integer"},
			{"type": "boolean"}
		],
		"additionalItems": {"type": "string"}
	};
	var valid = validate(data, schema);
	return !valid;
});

tests.add("additional items boolean success", function () {
	var data = [1, true, "one", "uno"];
	var schema = {
		"items": [
			{"type": "integer"},
			{"type": "boolean"}
		],
		"additionalItems": true
	};
	var valid = validate(data, schema);
	return valid;
});

tests.add("additional items boolean failure", function () {
	var data = [1, true, "one", "uno"];
	var schema = {
		"items": [
			{"type": "integer"},
			{"type": "boolean"}
		],
		"additionalItems": false
	};
	var valid = validate(data, schema);
	return !valid;
});
