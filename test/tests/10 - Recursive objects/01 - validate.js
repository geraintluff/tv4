describe("Recursive objects 01", function () {
	it("validate and variants do not choke on recursive objects", function () {
		var itemA = {};
		var itemB = { a: itemA };
		itemA.b = itemB;
		var aSchema = { properties: { b: { $ref: 'bSchema' }}};
		var bSchema = { properties: { a: { $ref: 'aSchema' }}};
		tv4.addSchema('aSchema', aSchema);
		tv4.addSchema('bSchema', bSchema);
		tv4.validate(itemA, aSchema, true);
		tv4.validate(itemA, aSchema, function () {}, true);
		tv4.validateResult(itemA, aSchema, true);
		tv4.validateMultiple(itemA, aSchema, true);
	});
});
