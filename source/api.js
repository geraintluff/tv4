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

var publicApi = {
	schemas: {},
	validate: function (data, schema) {
		if (typeof schema == "string") {
			schema = {"$ref": schema};
		}
		this.missing = [];
		this.addSchema("", schema);
		var error = validateAll(data, schema);
		delete this.schemas[""];
		this.error = error;
		if (error == null) {
			return true;
		} else {
			return false;
		}
	},
	addSchema: function (url, schema) {
		normSchema(schema, url);
		this.schemas[url] = schema;
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