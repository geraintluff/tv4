tests.add("skip unneeded", function () {
	var schema = {
		"items": {"$ref": "http://example.com/schema#"}
	};
	tv4.validate([], schema);
	return !tv4.missing["http://example.com/schema"]
		&& tv4.missing.length == 0;
});

tests.add("list missing (map)", function () {
	var schema = {
		"items": {"$ref": "http://example.com/schema#"}
	};
	tv4.validate([1,2,3], schema);
	return !!tv4.missing["http://example.com/schema"];
});

tests.add("list missing (index)", function () {
	var schema = {
		"items": {"$ref": "http://example.com/schema#"}
	};
	tv4.validate([1,2,3], schema);
	return tv4.missing[0] == "http://example.com/schema";
});