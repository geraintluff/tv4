function normSchema(schema, baseUri) {
	if (baseUri === undefined) {
		baseUri = schema.id;
	} else if (typeof schema.id === "string") {
		baseUri = resolveUrl(baseUri, schema.id);
		schema.id = baseUri;
	}
	if (typeof schema === "object") {
		if (Array.isArray(schema)) {
			for (var i = 0; i < schema.length; i++) {
				normSchema(schema[i], baseUri);
			}
		} else if (typeof schema['$ref'] === "string") {
			schema['$ref'] = resolveUrl(baseUri, schema['$ref']);
		} else {
			for (var key in schema) {
				if (key !== "enum") {
					normSchema(schema[key], baseUri);
				}
			}
		}
	}
}
