describe("Objects 05", function () {

	it("additionalProperties schema success", function () {
		var data = {intKey: 1, intKey2: 5, stringKey: "string"};
		var schema = {
			properties: {
				intKey: {"type": "integer"}
			},
			patternProperties: {
				"^int": {minimum: 0}
			},
			additionalProperties: {"type": "string"}
		};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("patternProperties schema failure", function () {
		var data = {intKey: 10, intKey2: 5, stringKey: null};
		var schema = {
			properties: {
				intKey: {minimum: 5}
			},
			patternProperties: {
				"^int": {"type": "integer"}
			},
			additionalProperties: {"type": "string"}
		};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});

	it("patternProperties boolean success", function () {
		var data = {intKey: 10, intKey2: 5, stringKey: null};
		var schema = {
			properties: {
				intKey: {minimum: 5}
			},
			patternProperties: {
				"^int": {"type": "integer"}
			},
			additionalProperties: true
		};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("patternProperties boolean failure", function () {
		var data = {intKey: 10, intKey2: 5, stringKey: null};
		var schema = {
			properties: {
				intKey: {minimum: 5}
			},
			patternProperties: {
				"^int": {"type": "integer"}
			},
			additionalProperties: false
		};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});

	it("additionalProperties inherited property success", function () {
		function DataMaker(o) {
			var self = this;
			Object.keys(o).forEach(function(key) {
				self[key] = o[key];
			});
		}
		DataMaker.prototype.extraMethod = function() {};
		var schema = {
			properties: {
				foo: {"type": "boolean"}
			},
			additionalProperties: false
		};
		var data = new DataMaker({foo: true});
		tv4.normSchema(schema);
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("additionalProperties non-enumerable property success", function () {
		var schema = {
			properties: {
				foo: {"type": "boolean"}
			},
			additionalProperties: false
		};
		var data = {};
		Object.defineProperty(data, 'hidden', {
			value: 0
		});
		tv4.normSchema(schema);
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});
});