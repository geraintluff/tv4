describe("Combinators 02", function () {

	it("anyOf success", function () {
	var data = "hello";
	var schema = {
		"anyOf": [
			{"type": "integer"},
			{"type": "string"},
			{"minLength": 1}
		]
	};
	var valid = tv4.validate(data, schema);
	assert.isTrue(valid);
});

it("anyOf failure", function () {
	var data = true;
	var schema = {
		"anyOf": [
			{"type": "integer"},
			{"type": "string"}
		]
	};
	var valid = tv4.validate(data, schema);
	assert.isFalse(valid);
});
});
