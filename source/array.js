ValidatorContext.prototype.validateArray = function validateArray(data, schema) {
	if (!Array.isArray(data)) {
		return null;
	}
	return this.validateArrayLength(data, schema)
		|| this.validateArrayUniqueItems(data, schema)
		|| this.validateArrayItems(data, schema)
		|| null;
}

ValidatorContext.prototype.validateArrayLength = function validateArrayLength(data, schema) {
	var error;
	if (schema.minItems !== undefined) {
		if (data.length < schema.minItems) {
			error = (new ValidationError(ErrorCodes.ARRAY_LENGTH_SHORT, "Array is too short (" + data.length + "), minimum " + schema.minItems)).prefixWith(null, "minItems");
			if (this.handleError(error)) {
				return error;
			}
		}
	}
	if (schema.maxItems !== undefined) {
		if (data.length > schema.maxItems) {
			error = (new ValidationError(ErrorCodes.ARRAY_LENGTH_LONG, "Array is too long (" + data.length + " chars), maximum " + schema.maxItems)).prefixWith(null, "maxItems");
			if (this.handleError(error)) {
				return error;
			}
		}
	}
	return null;
}

ValidatorContext.prototype.validateArrayUniqueItems = function validateArrayUniqueItems(data, schema) {
	if (schema.uniqueItems) {
		for (var i = 0; i < data.length; i++) {
			for (var j = i + 1; j < data.length; j++) {
				if (recursiveCompare(data[i], data[j])) {
					var error = (new ValidationError(ErrorCodes.ARRAY_UNIQUE, "Array items are not unique (indices " + i + " and " + j + ")")).prefixWith(null, "uniqueItems");
					if (this.handleError(error)) {
						return error;
					}
				}
			}
		}
	}
	return null;
}

ValidatorContext.prototype.validateArrayItems = function validateArrayItems(data, schema) {
	if (schema.items === undefined) {
		return null;
	}
	var error, i;
	if (Array.isArray(schema.items)) {
		for (i = 0; i < data.length; i++) {
			if (i < schema.items.length) {
				if (error = this.validateAll(data[i], schema.items[i], [i], ["items", i])) {
					return error;
				}
			} else if (schema.additionalItems !== undefined) {
				if (typeof schema.additionalItems == "boolean") {
					if (!schema.additionalItems) {
						error = (new ValidationError(ErrorCodes.ARRAY_ADDITIONAL_ITEMS, "Additional items not allowed")).prefixWith("" + i, "additionalItems");
						if (this.handleError(error)) {
							return error;
						}
					}
				} else if (error = this.validateAll(data[i], schema.additionalItems, [i], ["additionalItems"])) {
					return error;
				}
			}
		}
	} else {
		for (i = 0; i < data.length; i++) {
			if (error = this.validateAll(data[i], schema.items, [i], ["items"])) {
				return error;
			}
		}
	}
	return null;
}
