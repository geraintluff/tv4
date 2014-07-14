describe("Load language file", function () {
	it("commonjs language: de", function () {
		var tv4 = require('../').freshApi();
		
		tv4.addSchema('/polymorphic', {
			type: "object",
			properties: {
				"type": {type: "string"}
			},
			required: ["type"],
			links: [{
				rel: "describedby",
				href: "/schemas/{type}.json"
			}]
		});

		var res = tv4.validateResult({type: 'monkey'}, "/polymorphic");
		assert.isTrue(res.valid);
		assert.includes(res.missing, "/schemas/monkey.json");
		
		tv4.addSchema('/schemas/tiger.json', {
			properties: {
				"stripes": {"type": "integer", "minimum": 1}
			},
			required: ["stripes"]
		});
		
		var res2 = tv4.validateResult({type: 'tiger', stripes: -1}, "/polymorphic");
		assert.isFalse(res2.valid);
		assert.deepEqual(res2.missing.length, 0, "no schemas should be missing");

		var res3 = tv4.validateResult({type: 'tiger', stripes: 50}, "/polymorphic");
		assert.isTrue(res3.valid);
	});
});
