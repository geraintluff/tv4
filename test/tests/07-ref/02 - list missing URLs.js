describe("$ref 02", function () {

	it("skip unneeded", function () {
		var schema = {
			"items": {"$ref": "http://example.com/schema#"}
		};
		tv4.validate([], schema);
		assert.notProperty(tv4.missing, "http://example.com/schema");
		assert.length(tv4.missing, 0);
		//return !tv4.missing["http://example.com/schema"]
		//	&& tv4.missing.length == 0;
	});

	it("list missing (map)", function () {
		var schema = {
			"items": {"$ref": "http://example.com/schema#"}
		};
		tv4.validate([1, 2, 3], schema);
		assert.property(tv4.missing, "http://example.com/schema");
		//return !!tv4.missing["http://example.com/schema"];
	});

	it("list missing (index)", function () {
		var schema = {
			"items": {"$ref": "http://example.com/schema#"}
		};
		tv4.validate([1, 2, 3], schema);
		assert.length(tv4.missing, 1);
		assert.strictEqual(tv4.missing[0], "http://example.com/schema");
		//return tv4.missing[0] == "http://example.com/schema";
	});
});