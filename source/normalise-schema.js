function normSchema(schema, baseUri) {
	if (schema && typeof schema === "object") {
		var i;
		if (baseUri === undefined) {
			baseUri = schema.id;
		} else if (typeof schema.id === "string") {
			baseUri = resolveUrl(baseUri, schema.id);
			schema.id = baseUri;
		}
		if (Array.isArray(schema)) {
			for (i = 0; i < schema.length; i++) {
				normSchema(schema[i], baseUri);
			}
		} else if (typeof schema['$ref'] === "string") {
			schema['$ref'] = resolveUrl(baseUri, schema['$ref']);
		} else {
			var schemaKeys = Object.keys(schema);
			for (i = 0; i < schemaKeys.length; i++) {
				var key = schemaKeys[i];
				if (key !== "enum") {
					normSchema(schema[key], baseUri);
				}
			}
		}
	}
}
