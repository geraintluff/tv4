describe("Numeric 03", function () {

	it("NaN failure", function() {
		var data = NaN;
		var schema = {};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});
	
	it("Infinity failure", function() {
		var data = Infinity;
		var schema = {};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});
	
	it("-Infinity failure", function() {
		var data = -Infinity;
		var schema = {};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});
	
	it("string to number failure", function() {
		var data = Number('foo');
		var schema = {};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});
	
	it("string to number success", function() {
		var data = Number('123');
		var schema = {};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});
	
	it("max value success", function() {
		var data = Number.MAX_VALUE;
		var schema = {};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});
	
	/* Travis reports: Bad number '1.798e+308' (which is a good thing, as it should be Infinity)
	it("big number failure", function() {
		var data = 1.798e+308;
		var schema = {};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});
	*/
});
