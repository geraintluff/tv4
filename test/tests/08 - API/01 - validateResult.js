describe("API 01", function () {

	it("validateResult returns object with appropriate properties", function () {
		var data = {};
		var schema = {"type": "array"};
		tv4.error = null;
		tv4.missing = [];
		var result = tv4.validateResult(data, schema);

		assert.isFalse(result.valid, "result.valid === false");
		assert.isTypeOf(result.error, "object", "result.error is object");
		assert.isArray(result.missing, "result.missing is array");
		assert.isFalse(!!tv4.error, "tv4.error == null");

		//this.assert(result.valid === false, "result.valid === false");
		//this.assert(typeof result.error == "object", "result.error is object");
		//this.assert(Array.isArray(result.missing), "result.missing is array");
		//this.assert(tv4.error == null, "tv4.error == null");
	});
});
