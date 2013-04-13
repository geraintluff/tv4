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
	if (schema.minItems != undefined) {
		if (data.length < schema.minItems) {
			return (new ValidationError(ErrorCodes.ARRAY_LENGTH_SHORT, "Array is too short (" + data.length + "), minimum " + schema.minItems)).prefixWith(null, "minItems");
		}
	}
	if (schema.maxItems != undefined) {
		if (data.length > schema.maxItems) {
			return (new ValidationError(ErrorCodes.ARRAY_LENGTH_LONG, "Array is too long (" + data.length + " chars), maximum " + schema.maxItems)).prefixWith(null, "maxItems");
		}
	}
	return null;
}

ValidatorContext.prototype.validateArrayUniqueItems = function validateArrayUniqueItems(data, schema) {
	if (schema.uniqueItems) {
		for (var i = 0; i < data.length; i++) {
			for (var j = i + 1; j < data.length; j++) {
				if (recursiveCompare(data[i], data[j])) {
					return (new ValidationError(ErrorCodes.ARRAY_UNIQUE, "Array items are not unique (indices " + i + " and " + j + ")")).prefixWith(null, "uniqueItems");
				}
			}
		}
	}
	return null;
}

ValidatorContext.prototype.validateArrayItems = function validateArrayItems(data, schema) {
	if (schema.items == undefined) {
		return null;
	}
	var error;
	if (Array.isArray(schema.items)) {
		for (var i = 0; i < data.length; i++) {
			if (i < schema.items.length) {
				if (error = this.validateAll(data[i], schema.items[i])) {
					return error.prefixWith(null, "" + i).prefixWith("" + i, "items");
				}
			} else if (schema.additionalItems != undefined) {
				if (typeof schema.additionalItems == "boolean") {
					if (!schema.additionalItems) {
						return (new ValidationError(ErrorCodes.ARRAY_ADDITIONAL_ITEMS, "Additional items not allowed")).prefixWith("" + i, "additionalItems");
					}
				} else if (error = this.validateAll(data[i], schema.additionalItems)) {
					return error.prefixWith("" + i, "additionalItems");
				}
			}
		}
	} else {
		for (var i = 0; i < data.length; i++) {
			if (error = this.validateAll(data[i], schema.items)) {
				return error.prefixWith("" + i, "items");
			}
		}
	}
	return null;
}