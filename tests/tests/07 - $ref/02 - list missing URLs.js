tests.add("skip unneeded", function () {
	var schema = {
		"items": {"$ref": "http://example.com/schema#"}
	};
	var result = tv4.validate([], schema);
	return !result.missing["http://example.com/schema"]
		&& result.missing.length == 0;
});

tests.add("list missing (map)", function () {
	var schema = {
		"items": {"$ref": "http://example.com/schema#"}
	};
	var result = tv4.validate([1,2,3], schema);
	return !!result.missing["http://example.com/schema"];
});

tests.add("list missing (index)", function () {
	var schema = {
		"items": {"$ref": "http://example.com/schema#"}
	};
	var result = tv4.validate([1,2,3], schema);
	return result.missing[0] == "http://example.com/schema";
});