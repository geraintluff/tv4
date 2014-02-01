describe("Issue 67", function () {

	it("Example from GitHub issue #67", function () {
		// Make sure null values don't trip up the normalisation
		tv4.validate(null, {default: null});
	});
});