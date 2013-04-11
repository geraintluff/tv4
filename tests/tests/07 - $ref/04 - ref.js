tests.add("addSchema(), $ref", function () {
	var url = "http://example.com/schema" + Math.random();
	var schema = {
		"test": "value"
	};
	tv4.addSchema(url, schema);
	
	var otherSchema = {
		"items": {"$ref": url}
	};
	var result = tv4.validate([0,1,2,3], otherSchema);
	this.assert(result.valid, "should be valid");
	this.assert(result.missing.length == 0, "should have no missing schemas");
	return true;
});

tests.add("internal $ref", function () {
	var schema = {
		"type": "array",
		"items": {"$ref": "#"}
	};

    var result = tv4.validate([[],[[]]], schema);
	this.assert(result.valid, "List of lists should be valid");

    result = tv4.validate([0,1,2,3], schema);
    this.assert(!result.valid, "List of ints should not");

    result = tv4.validate([[true], []], schema);
	this.assert(!result.valid, "List of list with boolean should not");
	this.assert(result.missing.length == 0, "should have no missing schemas");

	return true;
});
