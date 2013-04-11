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

function extend( orig ) {
    var args = Array.prototype.slice.call( this, arguments );
    var result = args.shift();
    var arg = args.shift();
    while ( arg ) {
        for ( var prop in args ) {
            if ( args.hasOwnProperty( prop ) ) {
                result[prop] = args[prop];
            }
        }
        arg = args.shift();
    }
    return result;
}

var publicApi = {
	schemas: {},
	validate: function (data, schema) {
		if (typeof schema == "string") {
			schema = {"$ref": schema};
		}

        var repo = extend( {}, schema, this.schemas );
		this.addSchema("", schema, repo);

        var result = {
            missing : [],
        };

        var that = this;
        var getSchema = function(url) {
            return that.getSchema(url, repo, result.missing);
        };

        var error = validateAll(data, schema, getSchema);

        result.valid = error === null;
        result.errors = result.valid ? [] : [error];
        return result;
    },

	addSchema: function (url, schema, repo) {
        if (!repo) repo = this.schemas;
		var map = {};
		map[url] = schema;
		normSchema(schema, url);
		searchForTrustedSchemas(map, schema, url);
		for (var key in map) {
			repo[key] = map[key];
		}
		return map;
	},
	getSchema: function (url, repo, missing) {
        var i, schema;
        if (!repo) repo = this.schemas;
		if (repo[url] != undefined) {
			schema = repo[url];
			return schema;
		}
		var baseUrl = url;
		var fragment = "";
		if (url.indexOf('#') != -1) {
			fragment = url.substring(url.indexOf("#") + 1);
			baseUrl = url.substring(0, url.indexOf("#"));
		}
		if (repo[baseUrl] != undefined) {
			schema = repo[baseUrl];
			var pointerPath = decodeURIComponent(fragment);
			if (pointerPath == "") {
				return schema;
			} else if (pointerPath.charAt(0) != "/") {
				return undefined;
			}
			var parts = pointerPath.split("/").slice(1);
			for (i = 0; i < parts.length; i++) {
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
        if (missing) {
            if (missing[baseUrl] == undefined) {
                missing.push(baseUrl);
                missing[baseUrl] = baseUrl;
            }

        }
        /* It's a bit strange to use an array with elements both indexed and associative.
                 In case you wish to change this to a pure indexed array, this code is here.
         if (missing) {
             var found = false;
             for (i = 0, c = missing.length; i < c; i++)
                 if (missing[i] === baseUrl) {
                     found = true;
                     break;
                 }
             if (!found) missing.push(baseUrl);
         }
         */
    },
	normSchema: normSchema,
	resolveUrl: resolveUrl
};

global.tv4 = publicApi;
