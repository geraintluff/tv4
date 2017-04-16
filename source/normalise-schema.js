function normSchema(schema, baseUri, stack) {
	if (typeof stack === "undefined") {
		stack = [schema];
	} else {
		if (stack.indexOf(schema) >= 0) {
			return;
		}

		stack = stack.slice(0);
		stack.unshift(schema);
	}

	if (schema && typeof schema === "object") {
		if (baseUri === undefined) {
			baseUri = schema.id;
		} else if (typeof schema.id === "string") {
			baseUri = resolveUrl(baseUri, schema.id);
			schema.id = baseUri;
		}
		if (Array.isArray(schema)) {
			for (var i = 0; i < schema.length; i++) {
				normSchema(schema[i], baseUri, stack);
			}
		} else {
			if (typeof schema['$ref'] === "string") {
				schema['$ref'] = resolveUrl(baseUri, schema['$ref']);
			}
			for (var key in schema) {
				if (key !== "enum") {
					normSchema(schema[key], baseUri, stack);
				}
			}
		}
	}
}
