describe("Load language file", function () {
	if (!process || !require) {
		it.skip("commonjs language", function () {
			// dummy
		});
	}
	else {
		it("commonjs language: de", function () {
			var tv4 = require('../lang/de');

			tv4.language('de');

			var schema = {
				properties: {
					intKey: {"type": "integer"}
				}
			};
			var res = tv4.validateResult({intKey: 'bad'}, schema);
			assert.isFalse(res.valid);
			assert.equal(res.error.message, 'Ungültiger Typ: string (erwartet wurde: integer)');
		});
	}
});
