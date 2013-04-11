function validateArray(data, schema, getSchema) {
	if (!Array.isArray(data)) {
		return null;
	}
	return validateArrayLength(data, schema)
		|| validateArrayUniqueItems(data, schema)
		|| validateArrayItems(data, schema, getSchema)
		|| null;
}

function validateArrayLength(data, schema) {
	if (schema.minItems != undefined) {
		if (data.length < schema.minItems) {
			return (new ValidationError("Array is too short (" + data.length + "), minimum " + schema.minItems)).prefixWith(null, "minItems");
		}
	}
	if (schema.maxItems != undefined) {
		if (data.length > schema.maxItems) {
			return (new ValidationError("Array is too long (" + data.length + " chars), maximum " + schema.maxItems)).prefixWith(null, "maxItems");
		}
	}
	return null;
}

function validateArrayUniqueItems(data, schema) {
	if (schema.uniqueItems) {
		for (var i = 0; i < data.length; i++) {
			for (var j = i + 1; j < data.length; j++) {
				if (recursiveCompare(data[i], data[j])) {
					return (new ValidationError("Array items are not unique (indices " + i + " and " + j + ")")).prefixWith(null, "uniqueItems");
				}
			}
		}
	}
	return null;
}

function validateArrayItems(data, schema, getSchema) {
	if (schema.items == undefined) {
		return null;
	}
	var error;
	if (Array.isArray(schema.items)) {
		for (var i = 0; i < data.length; i++) {
			if (i < schema.items.length) {
				if (error = validateAll(data[i], schema.items[i], getSchema)) {
					return error.prefixWith(null, "" + i).prefixWith("" + i, "items");
				}
			} else if (schema.additionalItems != undefined) {
				if (typeof schema.additionalItems == "boolean") {
					if (!schema.additionalItems) {
						return (new ValidationError("Additional items not allowed")).prefixWith("" + i, "additionalItems");
					}
				} else if (error = validateAll(data[i], schema.additionalItems, getSchema)) {
					return error.prefixWith("" + i, "additionalItems");
				}
			}
		}
	} else {
		for (var i = 0; i < data.length; i++) {
			if (error = validateAll(data[i], schema.items, getSchema)) {
				return error.prefixWith("" + i, "items");
			}
		}
	}
	return null;
}