describe("Objects 07", function () {

	// used by multiple tests
	function DataObject() {}
	DataObject.prototype.getData = function() {};
	var data = new DataObject();
	data.stringKey = "string value";
	var schema = {
		properties: {
			"stringKey": {"type": "string"}
		},
		additionalProperties: false
	};

	it("inherited properties are ignored by default", function () {
		var valid = tv4.validateResult(data, schema).valid;
		assert.isTrue(valid);
	});

	it("inherited properties are validated when checkInheritedProperties is true", function () {
		var valid = tv4.validateResult(data, schema, {checkInheritedProperties: true}).valid;
		assert.isFalse(valid);
	});

});
