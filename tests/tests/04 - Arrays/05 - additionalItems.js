tests.add("additional items schema success", function () {
	var data = [1, true, "one", "uno"];
	var schema = {
		"items": [
			{"type": "integer"},
			{"type": "boolean"}
		],
		"additionalItems": {"type": "string"}
	};
	var result = tv4.validate(data, schema);
	return result.valid;
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
	var result = tv4.validate(data, schema);
	return !result.valid;
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
	var result = tv4.validate(data, schema);
	return result.valid;
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
	var result = tv4.validate(data, schema);
	return !result.valid;
});
