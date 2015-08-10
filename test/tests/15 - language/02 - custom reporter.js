describe("Load language file", function () {
	var api = tv4.freshApi();

	api.setErrorReporter(function (error) {
		return 'Code: ' + error.code;
	});

	var res = api.validateResult(5, {minimum: 10});
	assert.isFalse(res.valid);
	assert.equal(res.error.message, 'Code: 101');
});
