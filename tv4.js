/**
Author: Geraint Luff
Year: 2013

This code is released into the "public domain" by its author.  Anybody may use, alter and distribute the code without restriction.  The author makes no guarantees, and takes no liability of any kind for use of this code.

If you find a bug or make an improvement, it would be courteous to let the author know, but it is not compulsory.
**/

(function (global) {
function validateAll(data, schema) {
	if (schema['$ref'] != undefined) {
		schema = global.tv4.getSchema(schema['$ref']);
		if (!schema) {
			return null;
		}
	}
	var error = false;
	return validateBasic(data, schema)
		|| validateNumeric(data, schema)
		|| validateString(data, schema)
		|| validateArray(data, schema)
		|| validateObject(data, schema)
		|| validateCombinations(data, schema)
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

function validateBasic(data, schema) {
	var error;
	if (error = validateType(data, schema)) {
		return error.prefixWith(null, "type");
	}
	if (error = validateEnum(data, schema)) {
		return error.prefixWith(null, "type");
	}
	return null;
}

function validateType(data, schema) {
	if (schema.type == undefined) {
		return null;
	}
	var dataType = typeof data;
	if (data == null) {
		dataType = "null";
	} else if (Array.isArray(data)) {
		dataType = "array";
	}
	var allowedTypes = schema.type;
	if (typeof allowedTypes != "object") {
		allowedTypes = [allowedTypes];
	}
	
	for (var i = 0; i < allowedTypes.length; i++) {
		var type = allowedTypes[i];
		if (type == dataType || (type == "integer" && dataType == "number" && (data%1 == 0))) {
			return null;
		}
	}
	return new ValidationError("invalid data type: " + dataType);
}

function validateEnum(data, schema) {
	if (schema["enum"] == undefined) {
		return null;
	}
	for (var i = 0; i < schema["enum"].length; i++) {
		var enumVal = schema["enum"][i];
		if (recursiveCompare(data, enumVal)) {
			return null;
		}
	}
	return new ValidationError("No enum match for: " + JSON.stringify(data));
}
function validateNumeric(data, schema) {
	return validateMultipleOf(data, schema)
		|| validateMinMax(data, schema)
		|| null;
}

function validateMultipleOf(data, schema) {
	var multipleOf = schema.multipleOf || schema.divisibleBy;
	if (multipleOf == undefined) {
		return null;
	}
	if (typeof data == "number") {
		if (data%multipleOf != 0) {
			return new ValidationError("Value " + data + " is not a multiple of " + multipleOf);
		}
	}
	return null;
}

function validateMinMax(data, schema) {
	if (typeof data != "number") {
		return null;
	}
	if (schema.minimum != undefined) {
		if (data < schema.minimum) {
			return new ValidationError("Value " + data + " is less than minimum " + schema.minimum).prefixWith(null, "minimum");
		}
		if (schema.exclusiveMinimum && data == schema.minimum) {
			return new ValidationError("Value "+ data + " is equal to exclusive minimum " + schema.minimum).prefixWith(null, "exclusiveMinimum");
		}
	}
	if (schema.maximum != undefined) {
		if (data > schema.maximum) {
			return new ValidationError("Value " + data + " is greater than maximum " + schema.maximum).prefixWith(null, "maximum");
		}
		if (schema.exclusiveMaximum && data == schema.maximum) {
			return new ValidationError("Value "+ data + " is equal to exclusive maximum " + schema.maximum).prefixWith(null, "exclusiveMaximum");
		}
	}
	return null;
}
function validateString(data, schema) {
	return validateStringLength(data, schema)
		|| validateStringPattern(data, schema)
		|| null;
}

function validateStringLength(data, schema) {
	if (typeof data != "string") {
		return null;
	}
	if (schema.minLength != undefined) {
		if (data.length < schema.minLength) {
			return (new ValidationError("String is too short (" + data.length + " chars), minimum " + schema.minLength)).prefixWith(null, "minLength");
		}
	}
	if (schema.maxLength != undefined) {
		if (data.length > schema.maxLength) {
			return (new ValidationError("String is too long (" + data.length + " chars), maximum " + schema.maxLength)).prefixWith(null, "maxLength");
		}
	}
	return null;
}

function validateStringPattern(data, schema) {
	if (typeof data != "string" || schema.pattern == undefined) {
		return null;
	}
	var regexp = new RegExp(schema.pattern);
	if (!regexp.test(data)) {
		return new ValidationError("String does not match pattern").prefixWith(null, "pattern");
	}
	return null;
}
function validateArray(data, schema) {
	if (!Array.isArray(data)) {
		return null;
	}
	return validateArrayLength(data, schema)
		|| validateArrayUniqueItems(data, schema)
		|| validateArrayItems(data, schema)
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

function validateArrayItems(data, schema) {
	if (schema.items == undefined) {
		return null;
	}
	var error;
	if (Array.isArray(schema.items)) {
		for (var i = 0; i < data.length; i++) {
			if (i < schema.items.length) {
				if (error = validateAll(data[i], schema.items[i])) {
					return error.prefixWith(null, "" + i).prefixWith("" + i, "items");
				}
			} else if (schema.additionalItems != undefined) {
				if (typeof schema.additionalItems == "boolean") {
					if (!schema.additionalItems) {
						return (new ValidationError("Additional items not allowed")).prefixWith("" + i, "additionalItems");
					}
				} else if (error = validateAll(data[i], schema.additionalItems)) {
					return error.prefixWith("" + i, "additionalItems");
				}
			}
		}
	} else {
		for (var i = 0; i < data.length; i++) {
			if (error = validateAll(data[i], schema.items)) {
				return error.prefixWith("" + i, "items");
			}
		}
	}
	return null;
}
function validateObject(data, schema) {
	if (typeof data != "object" || data == null || Array.isArray(data)) {
		return null;
	}
	return validateObjectMinMaxProperties(data, schema)
		|| validateObjectRequiredProperties(data, schema)
		|| validateObjectProperties(data, schema)
		|| validateObjectDependencies(data, schema)
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

function validateObjectProperties(data, schema) {
	var error;
	for (var key in data) {
		var foundMatch = false;
		if (schema.properties != undefined && schema.properties[key] != undefined) {
			foundMatch = true;
			if (error = validateAll(data[key], schema.properties[key])) {
				return error.prefixWith(key, key).prefixWith(null, "properties");
			}
		}
		if (schema.patternProperties != undefined) {
			for (var patternKey in schema.patternProperties) {
				var regexp = new RegExp(patternKey);
				if (regexp.test(key)) {
					foundMatch = true;
					if (error = validateAll(data[key], schema.patternProperties[patternKey])) {
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
				if (error = validateAll(data[key], schema.additionalProperties)) {
					return error.prefixWith(key, "additionalProperties");
				}
			}
		}
	}
	return null;
}

function validateObjectDependencies(data, schema) {
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
					if (error = validateAll(data, dep)) {
						return error.prefixWith(null, depKey).prefixWith(null, "dependencies");
					}
				}
			}
		}
	}
	return null;
}

function validateCombinations(data, schema) {
	var error;
	return validateAllOf(data, schema)
		|| validateAnyOf(data, schema)
		|| validateOneOf(data, schema)
		|| validateNot(data, schema)
		|| null;
}

function validateAllOf(data, schema) {
	if (schema.allOf == undefined) {
		return null;
	}
	var error;
	for (var i = 0; i < schema.allOf.length; i++) {
		var subSchema = schema.allOf[i];
		if (error = validateAll(data, subSchema)) {
			return error.prefixWith(null, "" + i).prefixWith(null, "allOf");
		}
	}
}

function validateAnyOf(data, schema) {
	if (schema.anyOf == undefined) {
		return null;
	}
	var errors = [];
	for (var i = 0; i < schema.anyOf.length; i++) {
		var subSchema = schema.anyOf[i];
		var error = validateAll(data, subSchema);
		if (error == null) {
			return null;
		}
		errors.push(error.prefixWith(null, "" + i).prefixWith(null, "anyOf"));
	}
	return new ValidationError("Data does not match any schemas from \"anyOf\"", "", "/anyOf", errors);
}

function validateOneOf(data, schema) {
	if (schema.oneOf == undefined) {
		return null;
	}
	var validIndex = null;
	var errors = [];
	for (var i = 0; i < schema.oneOf.length; i++) {
		var subSchema = schema.oneOf[i];
		var error = validateAll(data, subSchema);
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

function validateNot(data, schema) {
	if (schema.not == undefined) {
		return null;
	}
	var error = validateAll(data, schema.not);
	if (error == null) {
		return new ValidationError("Data matches schema from \"not\"", "", "/not")
	}
	return null;
}

// parseURI() and resolveUrl() are from https://gist.github.com/1088850
//   -  released as public domain by author ("Yaffle") - see comments on gist

function parseURI(url) {
	var m = String(url).replace(/^\s+|\s+$/g, '').match(/^([^:\/?#]+:)?(\/\/(?:[^:@]*(?::[^:@]*)?@)?(([^:\/?#]*)(?::(\d*))?))?([^?#]*)(\?[^#]*)?(#[\s\S]*)?/);
	// authority = '//' + user + ':' + pass '@' + hostname + ':' port
	return (m ? {
		href     : m[0] || '',
		protocol : m[1] || '',
		authority: m[2] || '',
		host     : m[3] || '',
		hostname : m[4] || '',
		port     : m[5] || '',
		pathname : m[6] || '',
		search   : m[7] || '',
		hash     : m[8] || ''
	} : null);
}

function resolveUrl(base, href) {// RFC 3986

	function removeDotSegments(input) {
		var output = [];
		input.replace(/^(\.\.?(\/|$))+/, '')
			.replace(/\/(\.(\/|$))+/g, '/')
			.replace(/\/\.\.$/, '/../')
			.replace(/\/?[^\/]*/g, function (p) {
				if (p === '/..') {
					output.pop();
				} else {
					output.push(p);
				}
		});
		return output.join('').replace(/^\//, input.charAt(0) === '/' ? '/' : '');
	}

	href = parseURI(href || '');
	base = parseURI(base || '');

	return !href || !base ? null : (href.protocol || base.protocol) +
		(href.protocol || href.authority ? href.authority : base.authority) +
		removeDotSegments(href.protocol || href.authority || href.pathname.charAt(0) === '/' ? href.pathname : (href.pathname ? ((base.authority && !base.pathname ? '/' : '') + base.pathname.slice(0, base.pathname.lastIndexOf('/') + 1) + href.pathname) : base.pathname)) +
		(href.protocol || href.authority || href.pathname ? href.search : (href.search || base.search)) +
		href.hash;
}

function normSchema(schema, baseUri) {
	if (baseUri == undefined) {
		baseUri = schema.id;
	} else if (typeof schema.id == "string") {
		baseUri = resolveUrl(baseUri, schema.id);
		schema.id = baseUri;
	}
	if (typeof schema == "object") {
		if (Array.isArray(schema)) {
			for (var i = 0; i < schema.length; i++) {
				normSchema(schema[i], baseUri);
			}
		} else if (typeof schema['$ref'] == "string") {
			schema['$ref'] = resolveUrl(baseUri, schema['$ref']);
		} else {
			for (var key in schema) {
				if (key != "enum") {
					normSchema(schema[key], baseUri);
				}
			}
		}
	}
}

function ValidationError(message, dataPath, schemaPath, subErrors) {
	this.message = message;
	this.dataPath = dataPath ? dataPath : "";
	this.schemaPath = schemaPath ? schemaPath : "";
	this.subErrors = subErrors ? subErrors : null;
}
ValidationError.prototype = {
	prefixWith: function (dataPrefix, schemaPrefix) {
		if (dataPrefix != null) {
			dataPrefix = dataPrefix.replace("~", "~0").replace("/", "~1");
			this.dataPath = "/" + dataPrefix + this.dataPath;
		}
		if (schemaPrefix != null) {
			schemaPrefix = schemaPrefix.replace("~", "~0").replace("/", "~1");
			this.schemaPath = "/" + schemaPrefix + this.schemaPath;
		}
		if (this.subErrors != null) {
			for (var i = 0; i < this.subErrors.length; i++) {
				this.subErrors[i].prefixWith(dataPrefix, schemaPrefix);
			}
		}
		return this;
	}
};

function searchForTrustedSchemas(map, schema, url) {
	if (typeof schema.id == "string") {
		if (schema.id.substring(0, url.length) == url) {
			var remainder = schema.id.substring(url.length);
			if ((url.length > 0 && url.charAt(url.length - 1) == "/")
				|| remainder.charAt(0) == "#"
				|| remainder.charAt(0) == "?") {
				if (map[schema.id] == undefined) {
					map[schema.id] = schema;
				}
			}
		}
	}
	if (typeof schema == "object") {
		for (var key in schema) {
			if (key != "enum" && typeof schema[key] == "object") {
				searchForTrustedSchemas(map, schema[key], url);
			}
		}
	}
	return map;
}

var publicApi = {
	schemas: {},
	validate: function (data, schema) {
		if (typeof schema == "string") {
			schema = {"$ref": schema};
		}
		this.missing = [];
		var added = this.addSchema("", schema);
		var error = validateAll(data, schema);
		for (var key in added) {
			delete this.schemas[key];
		}
		this.error = error;
		if (error == null) {
			return true;
		} else {
			return false;
		}
	},
	addSchema: function (url, schema) {
		var map = {};
		map[url] = schema;
		normSchema(schema, url);
		searchForTrustedSchemas(map, schema, url);
		for (var key in map) {
			this.schemas[key] = map[key];
		}
		return map;
	},
	getSchema: function (url) {
		if (this.schemas[url] != undefined) {
			var schema = this.schemas[url];
			return schema;
		}
		var baseUrl = url;
		var fragment = "";
		if (url.indexOf('#') != -1) {
			fragment = url.substring(url.indexOf("#") + 1);
			baseUrl = url.substring(0, url.indexOf("#"));
		}
		if (this.schemas[baseUrl] != undefined) {
			var schema = this.schemas[baseUrl];
			var pointerPath = decodeURIComponent(fragment);
			if (pointerPath == "") {
				return schema;
			} else if (pointerPath.charAt(0) != "/") {
				return undefined;
			}
			var parts = pointerPath.split("/").slice(1);
			for (var i = 0; i < parts.length; i++) {
				var component = parts[i].replace("~1", "/").replace("~0", "~");
				if (schema[component] == undefined) {
					schema = undefined;
					break;
				}
				schema = schema[component];
			}
			if (schema != undefined) {
				return schema;
			}
		}
		if (this.missing[baseUrl] == undefined) {
			this.missing.push(baseUrl);
			this.missing[baseUrl] = baseUrl;
		}
	},
	missing: [],
	error: null,
	normSchema: normSchema,
	resolveUrl: resolveUrl
};

global.tv4 = publicApi;
})((typeof module !== 'undefined' && module.exports) ? exports : this);

