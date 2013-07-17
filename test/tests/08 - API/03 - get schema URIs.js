describe("API 03", function () {

	it("getSchemaUris() on clean tv4 returns an empty array", function () {
		var list = tv4.getSchemaUris();
		assert.isArray(list);
		assert.length(list, 0);
	});

	it("getSchemaUris() returns newly added schema urls", function () {
		tv4.addSchema("http://example.com/schema", {type: "object"});
		var list = tv4.getSchemaUris();
		assert.isArray(list);
		assert.length(list, 1);
		assert.strictEqual(list[0], "http://example.com/schema");
	});

	it("getMissingUris() returns only missing items", function () {
		var schema = {
			"items": {"$ref": "http://example.com/schema/item#"}
		};
		tv4.addSchema("http://example.com/schema/main", schema);

		var item = {
			"id": "http://example.com/schema/item",
			"type": "boolean"
		};

		var list;
		list = tv4.getSchemaUris();
		assert.isArray(list);
		assert.length(list, 1);
		assert.includes(list, "http://example.com/schema/main", 'map has main uri');

		list = tv4.getMissingUris();
		assert.isArray(list);
		assert.length(list, 1);
		assert.includes(list, "http://example.com/schema/item", 'map has item uri');

		tv4.addSchema(item);

		list = tv4.getMissingUris();
		assert.isArray(list);
		assert.length(list, 0);
	});

	it("getSchemaUris() optionally return filtered items", function () {
		var schema = {
			"items": {"$ref": "http://example.com/schema/item#"}
		};
		tv4.addSchema("http://example.com/schema/main", schema);

		var list;
		list = tv4.getSchemaUris(/schema\/main/);
		assert.isArray(list);
		assert.length(list, 1, 'list 1 main');
		assert.includes(list, "http://example.com/schema/main");

		list = tv4.getMissingUris(/^https?/);
		assert.isArray(list);
		assert.length(list, 1, 'list 1 item');
		assert.includes(list, "http://example.com/schema/item");
	});

	it("getSchemaUris() returns unique uris without fragment", function () {
		var schema = {
			"properties": {
				"alpha": {
					"$ref": "http://example.com/schema/lib#alpha"
				},
				"beta": {
					"$ref": "http://example.com/schema/lib#beta"
				}
			}
		};
		tv4.addSchema("http://example.com/schema/main", schema);
		var sub = {
			"id": "http://example.com/schema/item",
			"items": {
				"type": "boolean"
			}
		};
		tv4.addSchema(sub);

		var list;
		list = tv4.getSchemaUris();
		assert.isArray(list);
		assert.length(list, 2);
		assert.includes(list, "http://example.com/schema/main");
		assert.includes(list, "http://example.com/schema/item");

		list = tv4.getMissingUris();
		assert.isArray(list);
		assert.length(list, 1);
		assert.includes(list, "http://example.com/schema/lib");
	});


	it("getSchemaMap() on clean tv4 returns an empty object", function () {
		var map = tv4.getSchemaMap();
		assert.isObject(map);
		assert.isNotArray(map);
		var list = Object.keys(map);
		assert.length(list, 0);
	});

	it("getSchemaMap() returns an object mapping uris to schemas", function () {
		var schema = {
			"properties": {
				"alpha": {
					"$ref": "http://example.com/schema/lib#alpha"
				},
				"beta": {
					"$ref": "http://example.com/schema/lib#beta"
				}
			}
		};
		tv4.addSchema("http://example.com/schema/main", schema);
		var sub = {
			"id": "http://example.com/schema/item",
			"items": {
				"type": "boolean"
			}
		};
		tv4.addSchema(sub);

		var map;
		map = tv4.getSchemaMap();
		assert.length(Object.keys(map), 2);
		assert.ownPropertyVal(map, "http://example.com/schema/main", schema);
		assert.ownPropertyVal(map, "http://example.com/schema/item", sub);
	});
});
