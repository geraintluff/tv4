describe("Strings 02", function () {

	it("pattern success", function () {
		var data = "9test";
		var schema = {"pattern": "^[0-9][a-zA-Z]*$"};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("pattern failure", function () {
		var data = "9test9";
		var schema = {"pattern": "^[0-9][a-zA-Z]*$"};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});
	
  it("accepts RegExp object", function () {
    var data = "9test";
    var schema = {"pattern": /^[0-9][a-zA-Z]*$/};
    var valid = tv4.validate(data, schema);
    assert.isTrue(valid);
  });

  it("accepts RegExp literal", function () {
    var data = "9TEST";
    var schema = {"pattern": "/^[0-9][a-z]*$/i"};
    var valid = tv4.validate(data, schema);
    assert.isTrue(valid);
  });
});