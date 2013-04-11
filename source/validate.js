function validateAll(data, schema, getSchema) {
	if (schema['$ref'] != undefined) {
		schema = getSchema(schema['$ref']);
		if (!schema) {
			return null;
		}
	}
	return validateBasic(data, schema)
		|| validateNumeric(data, schema)
		|| validateString(data, schema)
		|| validateArray(data, schema, getSchema)
		|| validateObject(data, schema, getSchema)
		|| validateCombinations(data, schema, getSchema)
		|| null;
}

function recursiveCompare(A, B) {
	if (A === B) {
		return true;
	}
	if (typeof A == "object" && typeof B == "object") {
		if (Array.isArray(A) != Array.isArray(B)) {
			return false;
		} else if (Array.isArray(A)) {
			if (A.length != B.length) {
				return false
			}
			for (var i = 0; i < A.length; i++) {
				if (!recursiveCompare(A[i], B[i])) {
					return false;
				}
			}
		} else {
			for (var key in A) {
				if (B[key] === undefined && A[key] !== undefined) {
					return false;
				}
			}
			for (var key in B) {
				if (A[key] === undefined && B[key] !== undefined) {
					return false;
				}
			}
			for (var key in A) {
				if (!recursiveCompare(A[key], B[key])) {
					return false;
				}
			}
		}
		return true;
	}
	return false;
}
