tests.add("validateResult returns object with appropriate properties", function () {
	var data = {};
	var schema = {"type": "array"};
	tv4.error = null;
	tv4.missing = [];
	var result = tv4.validateResult(data, schema);
	
	this.assert(result.valid === false, "result.valid === false");
	this.assert(typeof result.error == "object", "result.error is object");
	this.assert(Array.isArray(result.missing), "result.missing is array");
	this.assert(tv4.error == null, "tv4.error == null");
	return true;
});
