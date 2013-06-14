describe("Arrays 02", function () {

	it("uniqueItems success", function () {
		var data = [1, true, "1"];
		var schema = {uniqueItems: true};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("uniqueItems failure", function () {
		var data = [1, true, "1", 1];
		var schema = {uniqueItems: true};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});
});
