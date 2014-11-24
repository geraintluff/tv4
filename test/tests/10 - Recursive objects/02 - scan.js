// We don't handle this in general (atm), but some users have had particular problems with things added to the Array prototype
describe("Recursive schemas", function () {
	it("due to extra Array.prototype entries", function () {
		var testSchema = {
			items: []
		};
		Array.prototype._testSchema = testSchema;
		
		// Failure mode will be a RangeError (stack size limit)
		tv4.addSchema('testSchema', testSchema);
		
		delete Array.prototype._testSchema;
	});
});
