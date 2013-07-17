describe("Core 01", function () {

	it("getDocumentUri returns only location part of url", function () {

		assert.strictEqual(tv4.getDocumentUri("http://example.com"), "http://example.com");

		assert.strictEqual(tv4.getDocumentUri("http://example.com/main"), "http://example.com/main");
		assert.strictEqual(tv4.getDocumentUri("http://example.com/main/"), "http://example.com/main/");
		//assert.strictEqual(tv4.getDocumentUri("http://example.com/main//"), "http://example.com/main/");

		assert.strictEqual(tv4.getDocumentUri("http://example.com/main/sub"), "http://example.com/main/sub");
		assert.strictEqual(tv4.getDocumentUri("http://example.com/main/sub/"), "http://example.com/main/sub/");

		assert.strictEqual(tv4.getDocumentUri("http://example.com/main#"), "http://example.com/main");
		assert.strictEqual(tv4.getDocumentUri("http://example.com/main/sub/#"), "http://example.com/main/sub/");

		assert.strictEqual(tv4.getDocumentUri("http://example.com/main?"), "http://example.com/main?");
		assert.strictEqual(tv4.getDocumentUri("http://example.com/main?q=1"), "http://example.com/main?q=1");
		assert.strictEqual(tv4.getDocumentUri("http://example.com/main?q=1#abc"), "http://example.com/main?q=1");

		assert.strictEqual(tv4.getDocumentUri("http://example.com/main/#"), "http://example.com/main/");
		assert.strictEqual(tv4.getDocumentUri("http://example.com/main/#?"), "http://example.com/main/");
		assert.strictEqual(tv4.getDocumentUri("http://example.com/main/#?q=a/b/c"), "http://example.com/main/");
	});
});
