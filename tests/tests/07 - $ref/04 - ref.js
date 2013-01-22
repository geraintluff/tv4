tests.add("addSchema(), $ref", function () {
	var url = "http://example.com/schema" + Math.random();
	var schema = {
		"test": "value"
	};
	tv4.addSchema(url, schema);
	
	var otherSchema = {
		"items": {"$ref": url}
	}
	var valid = tv4.validate([0,1,2,3], otherSchema);
	this.assert(valid, "should be valid");
	this.assert(tv4.missing.length == 0, "should have no missing schemas");
	return true;
});

tests.add("internal $ref", function () {
	var schema = {
		"type": "array",
		"items": {"$ref": "#"}
	};
	
	this.assert(tv4.validate([[],[[]]], schema), "List of lists should be valid");
	this.assert(!tv4.validate([0,1,2,3], schema), "List of ints should not");
	this.assert(!tv4.validate([[true], []], schema), "List of list with boolean should not");

	this.assert(tv4.missing.length == 0, "should have no missing schemas");
	return true;
});
