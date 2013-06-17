describe("Objects 06", function () {

	it("string dependency success", function () {
		var data = {key1: 5, key2: "string"};
		var schema = {
			dependencies: {
				key1: "key2"
			}
		};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("string dependency failure", function () {
		var data = {key1: 5};
		var schema = {
			dependencies: {
				key1: "key2"
			}
		};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});

	it("array dependency success", function () {
		var data = {key1: 5, key2: "string"};
		var schema = {
			dependencies: {
				key1: ["key2"]
			}
		};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("array dependency failure", function () {
		var data = {key1: 5};
		var schema = {
			dependencies: {
				key1: ["key2"]
			}
		};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});

	it("schema dependency success", function () {
		var data = {key1: 5, key2: "string"};
		var schema = {
			dependencies: {
				key1: {
					properties: {
						key2: {"type": "string"}
					}
				}
			}
		};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("schema dependency failure", function () {
		var data = {key1: 5, key2: 5};
		var schema = {
			dependencies: {
				key1: {
					properties: {
						key2: {"type": "string"}
					}
				}
			}
		};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});
});
