function validateObject(data, schema, getSchema) {
	if (typeof data != "object" || data == null || Array.isArray(data)) {
		return null;
	}
	return validateObjectMinMaxProperties(data, schema)
		|| validateObjectRequiredProperties(data, schema)
		|| validateObjectProperties(data, schema, getSchema)
		|| validateObjectDependencies(data, schema, getSchema)
		|| null;
}

function validateObjectMinMaxProperties(data, schema) {
	var keys = Object.keys(data);
	if (schema.minProperties != undefined) {
		if (keys.length < schema.minProperties) {
			return new ValidationError("Too few properties defined (" + keys.length + "), minimum " + schema.minProperties).prefixWith(null, "minProperties");
		}
	}
	if (schema.maxProperties != undefined) {
		if (keys.length > schema.maxProperties) {
			return new ValidationError("Too many properties defined (" + keys.length + "), maximum " + schema.maxProperties).prefixWith(null, "maxProperties");
		}
	}
	return null;
}

function validateObjectRequiredProperties(data, schema) {
	if (schema.required != undefined) {
		for (var i = 0; i < schema.required.length; i++) {
			var key = schema.required[i];
			if (data[key] === undefined) {
				return new ValidationError("Missing required property: " + key).prefixWith(null, "" + i).prefixWith(null, "required")
			}
		}
	}
	return null;
}

function validateObjectProperties(data, schema, getSchema) {
	var error;
	for (var key in data) {
		var foundMatch = false;
		if (schema.properties != undefined && schema.properties[key] != undefined) {
			foundMatch = true;
			if (error = validateAll(data[key], schema.properties[key], getSchema)) {
				return error.prefixWith(key, key).prefixWith(null, "properties");
			}
		}
		if (schema.patternProperties != undefined) {
			for (var patternKey in schema.patternProperties) {
				var regexp = new RegExp(patternKey);
				if (regexp.test(key)) {
					foundMatch = true;
					if (error = validateAll(data[key], schema.patternProperties[patternKey], getSchema)) {
						return error.prefixWith(key, patternKey).prefixWith(null, "patternProperties");
					}
				}
			}
		}
		if (!foundMatch && schema.additionalProperties != undefined) {
			if (typeof schema.additionalProperties == "boolean") {
				if (!schema.additionalProperties) {
					return new ValidationError("Additional properties not allowed").prefixWith(key, "additionalProperties");
				}
			} else {
				if (error = validateAll(data[key], schema.additionalProperties, getSchema)) {
					return error.prefixWith(key, "additionalProperties");
				}
			}
		}
	}
	return null;
}

function validateObjectDependencies(data, schema, getSchema) {
	var error;
	if (schema.dependencies != undefined) {
		for (var depKey in schema.dependencies) {
			if (data[depKey] !== undefined) {
				var dep = schema.dependencies[depKey];
				if (typeof dep == "string") {
					if (data[dep] === undefined) {
						return new ValidationError("Dependency failed - key must exist: " + dep).prefixWith(null, depKey).prefixWith(null, "dependencies");
					}
				} else if (Array.isArray(dep)) {
					for (var i = 0; i < dep.length; i++) {
						var requiredKey = dep[i];
						if (data[requiredKey] === undefined) {
							return new ValidationError("Dependency failed - key must exist: " + requiredKey).prefixWith(null, "" + i).prefixWith(null, depKey).prefixWith(null, "dependencies");
						}
					}
				} else {
					if (error = validateAll(data, dep, getSchema)) {
						return error.prefixWith(null, depKey).prefixWith(null, "dependencies");
					}
				}
			}
		}
	}
	return null;
}
