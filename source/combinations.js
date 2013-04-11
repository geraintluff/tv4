function validateCombinations(data, schema, getSchema) {
	return validateAllOf(data, schema)
		|| validateAnyOf(data, schema, getSchema)
		|| validateOneOf(data, schema, getSchema)
		|| validateNot(data, schema, getSchema)
		|| null;
}

function validateAllOf(data, schema, getSchema) {
	if (schema.allOf == undefined) {
		return null;
	}
	var error;
	for (var i = 0; i < schema.allOf.length; i++) {
		var subSchema = schema.allOf[i];
		if (error = validateAll(data, subSchema, getSchema)) {
			return error.prefixWith(null, "" + i).prefixWith(null, "allOf");
		}
	}

    //todo: What happens if we reach here? What is the return value?
}

function validateAnyOf(data, schema, getSchema) {
	if (schema.anyOf == undefined) {
		return null;
	}
	var errors = [];
	for (var i = 0; i < schema.anyOf.length; i++) {
		var subSchema = schema.anyOf[i];
		var error = validateAll(data, subSchema, getSchema);
		if (error == null) {
			return null;
		}
		errors.push(error.prefixWith(null, "" + i).prefixWith(null, "anyOf"));
	}
	return new ValidationError("Data does not match any schemas from \"anyOf\"", "", "/anyOf", errors);
}

function validateOneOf(data, schema, getSchema) {
	if (schema.oneOf == undefined) {
		return null;
	}
	var validIndex = null;
	var errors = [];
	for (var i = 0; i < schema.oneOf.length; i++) {
		var subSchema = schema.oneOf[i];
		var error = validateAll(data, subSchema, getSchema);
		if (error == null) {
			if (validIndex == null) {
				validIndex = i;
			} else {
				return new ValidationError("Data is valid against more than one schema from \"oneOf\": indices " + validIndex + " and " + i, "", "/oneOf");
			}
		} else {
			errors.push(error.prefixWith(null, "" + i).prefixWith(null, "oneOf"));
		}
	}
	if (validIndex == null) {
		return new ValidationError("Data does not match any schemas from \"oneOf\"", "", "/oneOf", errors);
	}
	return null;
}

function validateNot(data, schema, getSchema) {
	if (schema.not == undefined) {
		return null;
	}
	var error = validateAll(data, schema.not, getSchema);
	if (error == null) {
		return new ValidationError("Data matches schema from \"not\"", "", "/not")
	}
	return null;
}
