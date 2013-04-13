'use strict';

/**
 * Polyfill for the JS Object.keys function.
 * From https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/keys
 */
if ( !Object.keys ) {
    Object.keys = (function () {
        var hasOwnProperty = Object.prototype.hasOwnProperty,
            hasDontEnumBug = !({toString : null}).propertyIsEnumerable( 'toString' ),
            dontEnums = [
                'toString',
                'toLocaleString',
                'valueOf',
                'hasOwnProperty',
                'isPrototypeOf',
                'propertyIsEnumerable',
                'constructor'
            ],
            dontEnumsLength = dontEnums.length;

        return function ( obj ) {
            if ( typeof obj !== 'object' && typeof obj !== 'function' || obj === null ) throw new TypeError( 'Object.keys called on non-object' );

            var result = [];

            for ( var prop in obj ) {
                if ( hasOwnProperty.call( obj, prop ) ) result.push( prop );
            }

            if ( hasDontEnumBug ) {
                for ( var i = 0; i < dontEnumsLength; i++ ) {
                    if ( hasOwnProperty.call( obj, dontEnums[i] ) ) result.push( dontEnums[i] );
                }
            }
            return result;
        }
    })()
}

/**
 * Polyfill for the Array.forEach function.
 * todo: Test on IE7 and IE8
 */
if ( !Array.prototype.forEach ) {
    Array.prototype.forEach = function ( fn, scope ) {
        for ( var i = 0, len = this.length; i < len; ++i ) {
            fn.call( scope, this[i], i, this );
        }
    }
}

/**
 * Polyfill for the Array.isArray function
 * todo: Test on IE7 and IE8
 */
Array.isArray || (Array.isArray = function ( a ) {
    return'' + a !== a && {}.toString.call( a ) == '[object Array]'
});

function extend( orig ) {
    var args = Array.prototype.slice.call( arguments, 0 );
    var result = args.shift();
    var arg = args.shift();
    while ( arg ) {
        for ( var prop in arg ) {
            if ( arg.hasOwnProperty( prop ) ) {
                result[prop] = arg[prop];
            }
        }
        arg = args.shift();
    }
    return result;
}


/**
 * Creates an instance which can be used to validate JSON objects according to
 * version 4 of the json-schema specification.
 *
 * @param url
 * @param schema
 * @return {Object}
 * @constructor
 */
var JsonSchema = function ( url, schema ) {
    var schemaRepo = {};

    /**
     * Breaks a URL up into its component parts.
     * https://gist.github.com/1088850
     *
     * @param {String} url The url to break down
     * @return {Object} A breakdown of a uri into its component parts
     */
    function parseURI( url ) {
        var m = String( url ).replace( /^\s+|\s+$/g, '' ).match( /^([^:\/?#]+:)?(\/\/(?:[^:@]*(?::[^:@]*)?@)?(([^:\/?#]*)(?::(\d*))?))?([^?#]*)(\?[^#]*)?(#[\s\S]*)?/ );
        return (m ? {
            href : m[0] || '',
            protocol : m[1] || '',
            authority : m[2] || '',
            host : m[3] || '',
            hostname : m[4] || '',
            port : m[5] || '',
            pathname : m[6] || '',
            search : m[7] || '',
            hash : m[8] || ''
        } : null);
    }

    /**
     * Form a canonical url from the combination of a base uri and an absolute or
     * relative url.
     * https://gist.github.com/1088850
     *
     * @param {String} base A uri that stands as the starting point
     * @param {String} href The uri reference that can be absolute, or relative to the base
     * @return {String} The canonical url based on the base uri and the href
     */
    function resolveUrl( base, href ) {// RFC 3986

        function removeDotSegments( input ) {
            var output = [];
            input.replace( /^(\.\.?(\/|$))+/, '' )
                .replace( /\/(\.(\/|$))+/g, '/' )
                .replace( /\/\.\.$/, '/../' )
                .replace( /\/?[^\/]*/g, function ( p ) {
                    if ( p === '/..' ) {
                        output.pop();
                    } else {
                        output.push( p );
                    }
                } );
            return output.join( '' ).replace( /^\//, input.charAt( 0 ) === '/' ? '/' : '' );
        }

        //noinspection JSValidateTypes
        href = parseURI( href || '' );
        //noinspection JSValidateTypes
        base = parseURI( base || '' );

        return !href || !base ? null : (href.protocol || base.protocol) +
            (href.protocol || href.authority ? href.authority : base.authority) +
            removeDotSegments( href.protocol || href.authority || href.pathname.charAt( 0 ) === '/' ? href.pathname : (href.pathname ? ((base.authority && !base.pathname ? '/' : '') + base.pathname.slice( 0, base.pathname.lastIndexOf( '/' ) + 1 ) + href.pathname) : base.pathname) ) +
            (href.protocol || href.authority || href.pathname ? href.search : (href.search || base.search)) +
            href.hash;
    }


    /**
     * Make sure that any urls in the schema are canonical urls relative to the
     * original base uri.
     *
     * @param {Object|Array} schema A json schema
     * @param {String} [baseUri] The base uri to use when resolving relative urls. If not
     * provided, the schema.id value will be used.
     */
    function normSchema( schema, baseUri ) {
        // Schema id will be used if no baseUri is provided
        if ( !baseUri ) baseUri = schema.id;

        // If there is both a baseUri and a schema.id present, we will update both
        // values to a canonical version of the schema.id relative to the baseUri.
        else if ( typeof schema.id === "string" ) {
            baseUri = resolveUrl( baseUri, schema.id );
            schema.id = baseUri;
        }

        // todo: Any issues if baseUri is undefined at this point?

        //  We wish to find any
        if ( typeof schema == "object" ) {
            // If the schema is an array, we can loop through each of them and process
            // individually
            if ( Array.isArray( schema ) ) {
                for ( var i = 0; i < schema.length; i++ ) {
                    normSchema( schema[i], baseUri );
                }
            } else
            // If the schema has an $ref property, we will resolve it relative to the
            // baseUri
            if ( typeof schema['$ref'] == "string" ) {
                schema['$ref'] = resolveUrl( baseUri, schema['$ref'] );
            }

            // Finally, we will iterate over all of the properties of the schema, and
            // process any objects, $ref and arrays to ensure all uri's are canonical
            else {
                Object.keys( schema ).forEach( function ( key ) {
                    // enum is an array that we don't have to dig into
                    if ( key != "enum" ) {
                        normSchema( schema[key], baseUri );
                    }
                } );
            }
        }
    }


    /**
     * Traverses the schema and adds the trusted schema.id values to a lookup map that is
     * passed in as 'map'. A "trusted" schema is one that begins with the same url as is
     * passed in.
     *
     * @param {Object} repo A lookup table of schema.id keys and the corresponding schema
     * values
     * @param {Object} schema The schema to traverse
     * @param {String} url The url used to compare to schema.id to determine "truse"
     */
    function searchForTrustedSchemas( repo, schema, url ) {
        // Populate the map with the schema.id lookup value
        if ( typeof schema.id == "string" ) {
            // If the schema.id starts with the url
            if ( schema.id.substring( 0, url.length ) == url ) {
                var remainder = schema.id.substring( url.length );
                // Get everything to the right of the url from the schema.id
                // todo: regex candidate
                if ( (url.length > 0 && url.charAt( url.length - 1 ) == "/")
                    || remainder.charAt( 0 ) == "#"
                    || remainder.charAt( 0 ) == "?" ) {
                    if ( repo[schema.id] == undefined ) {
                        repo[schema.id] = schema;
                    }
                }
            }
        }
        // Recurse into the schema and filling out the map of schema.id lookups
        if ( typeof schema == "object" ) {
            Object.keys( schema ).forEach( function ( key ) {
                if ( key != "enum" && typeof schema[key] == "object" ) {
                    searchForTrustedSchemas( repo, schema[key], url );
                }
            } );
        }
    }


    /**
     * Traverses the 'schema' and makes sure that all uri's are fully qualified and
     * canonical. Once that is done, the schema repository is populated with schema
     * identifiers that can be resolved relative to the 'url' passed in.
     *
     * @param {String} url
     * @param {Object|Array} schema
     */
    function addSchema( url, schema, repo ) {
        if ( !repo ) repo = schemaRepo;
        normSchema( schema, url );
        searchForTrustedSchemas( repo, schema, url );
        repo[url] = schema;
    }

    /**
     * Loads the schema from the repository and keeps track of unresolved schemas in the
     * errors array.
     *
     * @param url
     * @param repo
     * @param missing
     * @return {*}
     */
    function getSchema( url, repo, missing ) {
        var i, c;
        if ( !repo ) repo = schemaRepo;

        // Return the cached schema if it exists
        var schema = repo[url];
        if ( schema ) return schema;
        var baseUrl = url;
        var fragment = "";
        if ( url.indexOf( '#' ) != -1 ) {
            fragment = url.substring( url.indexOf( "#" ) + 1 );
            baseUrl = url.substring( 0, url.indexOf( "#" ) );
        }

        if ( repo[baseUrl] ) {
            schema = repo[baseUrl];
            var pointerPath = decodeURIComponent( fragment );
            if ( pointerPath == "" ) {
                return schema;
            } else if ( pointerPath.charAt( 0 ) != "/" ) {
                return undefined;
            }
            var parts = pointerPath.split( "/" ).slice( 1 );
            for ( i = 0; i < parts.length; i++ ) {
                var component = parts[i].replace( "~1", "/" ).replace( "~0", "~" );
                if ( schema[component] == undefined ) {
                    schema = undefined;
                    break;
                }
                schema = schema[component];
            }
            if ( schema ) return schema;
        }
        var contains = function ( missing, url ) {
            if ( !missing ) return true;
            for ( i = 0, c = missing.length; i < c; i++ )
                if ( missing[i] === baseUrl ) return true;
            return false;
        };

        if ( !contains( missing, baseUrl ) ) missing.push( baseUrl );
    }


    /**
     * Validates an instance against the schemas that have been preloaded into the
     * repository. A schema may also be included in the function call, but it only has
     * bearing during this particular function call. It is not added to the repository.
     *
     * @param instance
     * @param schema
     * @return {Object}
     */
    function validate( instance, schema ) {
        if ( typeof schema == "string" ) schema = {"$ref" : schema};

        // Make a clone of the schema repository created by using addSchema()
        var repo = extend( {}, schemaRepo );

        // Normalize the uris in the temporary schema (if present)
        if ( schema ) {
            addSchema( '', schema, repo );
        }

        var errors = [];
        var missing = [];

        var loadSchema = function ( url ) {
            return getSchema( url, repo, missing );
        };

        validateAll( instance, schema, loadSchema, errors );

        return {
            valid : errors.length === 0,
            errors : errors,
            missing : missing,
            isMissing : function ( url ) {
                for ( var i = 0, c = missing.length; i < c; i++ )
                    if ( missing[i] === url ) return true;
                return false;
            }
        };
    }

    function generate( schema ) {

    }

    /**
     *
     * @param message
     * @param [dataPath]
     * @param [schemaPath]
     * @param [subErrors]
     * @constructor
     */
    function ValidationError( message, dataPath, schemaPath, subErrors ) {
        //noinspection JSUnusedGlobalSymbols
        this.message = message;
        this.dataPath = dataPath ? dataPath : "";
        this.schemaPath = schemaPath ? schemaPath : "";
        this.subErrors = subErrors ? subErrors : null;
    }

    ValidationError.prototype = {
        prefixWith : function ( dataPrefix, schemaPrefix ) {
            if ( dataPrefix != null ) {
                dataPrefix = dataPrefix.replace( "~", "~0" ).replace( "/", "~1" );
                this.dataPath = "/" + dataPrefix + this.dataPath;
            }
            if ( schemaPrefix != null ) {
                schemaPrefix = schemaPrefix.replace( "~", "~0" ).replace( "/", "~1" );
                this.schemaPath = "/" + schemaPrefix + this.schemaPath;
            }
            if ( this.subErrors != null ) {
                for ( var i = 0; i < this.subErrors.length; i++ ) {
                    this.subErrors[i].prefixWith( dataPrefix, schemaPrefix );
                }
            }
            return this;
        }
    };

    function validateAll( data, schema, getSchema, errors ) {
        if ( schema['$ref'] != undefined ) {
            schema = getSchema( schema['$ref'] );
            if ( !schema ) {
                return null;
            }
        }
        return validateBasic( data, schema, errors )
            || validateNumeric( data, schema, errors )
            || validateString( data, schema, errors )
            || validateArray( data, schema, getSchema, errors )
            || validateObject( data, schema, getSchema, errors )
            || validateCombinations( data, schema, getSchema, errors )
            || null;


        function recursiveCompare( A, B ) {
            var key;
            if ( A === B ) {
                return true;
            }
            if ( typeof A == "object" && typeof B == "object" ) {
                if ( Array.isArray( A ) != Array.isArray( B ) ) {
                    return false;
                } else if ( Array.isArray( A ) ) {
                    if ( A.length != B.length ) {
                        return false
                    }
                    for ( var i = 0; i < A.length; i++ ) {
                        if ( !recursiveCompare( A[i], B[i] ) ) {
                            return false;
                        }
                    }
                } else {
                    for ( key in A ) {
                        if ( B[key] === undefined && A[key] !== undefined ) {
                            return false;
                        }
                    }
                    for ( key in B ) {
                        if ( A[key] === undefined && B[key] !== undefined ) {
                            return false;
                        }
                    }
                    for ( key in A ) {
                        if ( !recursiveCompare( A[key], B[key] ) ) {
                            return false;
                        }
                    }
                }
                return true;
            }
            return false;
        }

        function validateBasic( data, schema, errors ) {
            var error;
            if ( error = validateType( data, schema, errors ) ) {
                return error.prefixWith( null, "type" );
            }
            if ( error = validateEnum( data, schema, errors ) ) {
                return error.prefixWith( null, "type" );
            }
            return null;
        }

        function validateType( data, schema, errors ) {
            if ( schema.type == undefined ) {
                return null;
            }
            var dataType = typeof data;
            if ( data == null ) {
                dataType = "null";
            } else if ( Array.isArray( data ) ) {
                dataType = "array";
            }
            var allowedTypes = schema.type;
            if ( typeof allowedTypes != "object" ) {
                allowedTypes = [allowedTypes];
            }

            for ( var i = 0; i < allowedTypes.length; i++ ) {
                var type = allowedTypes[i];
                if ( type == dataType || (type == "integer" && dataType == "number" && (data % 1 == 0)) ) {
                    return null;
                }
            }
            var error = new ValidationError( "invalid data type: " + dataType );
            errors.push( error );
            return error;
        }

        function validateEnum( data, schema, errors ) {
            if ( schema["enum"] == undefined ) {
                return null;
            }
            for ( var i = 0; i < schema["enum"].length; i++ ) {
                var enumVal = schema["enum"][i];
                if ( recursiveCompare( data, enumVal ) ) {
                    return null;
                }
            }
            var error = new ValidationError( "No enum match for: " + JSON.stringify( data ) );
            errors.push( error );
            return error;
        }

        function validateNumeric( data, schema, errors ) {
            return validateMultipleOf( data, schema, errors )
                || validateMinMax( data, schema, errors )
                || null;
        }

        function validateMultipleOf( data, schema, errors ) {
            var error;
            var multipleOf = schema.multipleOf || schema.divisibleBy;
            if ( multipleOf == undefined ) {
                return null;
            }
            if ( typeof data == "number" ) {
                if ( data % multipleOf !== 0 ) {
                    error = new ValidationError( "Value " + data + " is not a multiple of " + multipleOf );
                    errors.push( error );
                    return error;
                }
            }
            return null;
        }

        function validateMinMax( data, schema, errors ) {
            var error;
            if ( typeof data != "number" ) {
                return null;
            }
            if ( schema.minimum != undefined ) {
                if ( data < schema.minimum ) {
                    error = new ValidationError( "Value " + data + " is less than minimum " + schema.minimum ).prefixWith( null, "minimum" );
                    errors.push( error );
                    return error;
                }
                if ( schema.exclusiveMinimum && data == schema.minimum ) {
                    error = new ValidationError( "Value " + data + " is equal to exclusive minimum " + schema.minimum ).prefixWith( null, "exclusiveMinimum" );
                    errors.push( error );
                    return error;
                }
            }
            if ( schema.maximum != undefined ) {
                if ( data > schema.maximum ) {
                    error = new ValidationError( "Value " + data + " is greater than maximum " + schema.maximum ).prefixWith( null, "maximum" );
                    errors.push( error );
                    return error;
                }
                if ( schema.exclusiveMaximum && data == schema.maximum ) {
                    error = new ValidationError( "Value " + data + " is equal to exclusive maximum " + schema.maximum ).prefixWith( null, "exclusiveMaximum" );
                    errors.push( error );
                    return error;
                }
            }
            return null;
        }

        function validateString( data, schema, errors ) {
            return validateStringLength( data, schema, errors )
                || validateStringPattern( data, schema, errors )
                || null;
        }

        function validateStringLength( data, schema, errors ) {
            var error;
            if ( typeof data != "string" ) {
                return null;
            }
            if ( schema.minLength != undefined ) {
                if ( data.length < schema.minLength ) {
                    error = (new ValidationError( "String is too short (" + data.length + " chars), minimum " + schema.minLength )).prefixWith( null, "minLength" );
                    errors.push( error );
                    return error;
                }
            }
            if ( schema.maxLength != undefined ) {
                if ( data.length > schema.maxLength ) {
                    error = (new ValidationError( "String is too long (" + data.length + " chars), maximum " + schema.maxLength )).prefixWith( null, "maxLength" );
                    errors.push( error );
                    return error;
                }
            }
            return null;
        }

        function validateStringPattern( data, schema, errors ) {
            if ( typeof data != "string" || schema.pattern == undefined ) {
                return null;
            }
            var regexp = new RegExp( schema.pattern );
            if ( !regexp.test( data ) ) {
                var error = new ValidationError( "String does not match pattern" ).prefixWith( null, "pattern" );
                errors.push( error );
                return error;
            }
            return null;
        }

        function validateArray( data, schema, getSchema, errors ) {
            if ( !Array.isArray( data ) ) {
                return null;
            }
            return validateArrayLength( data, schema, errors )
                || validateArrayUniqueItems( data, schema, errors )
                || validateArrayItems( data, schema, getSchema, errors )
                || null;
        }

        function validateArrayLength( data, schema, errors ) {
            var error;
            if ( schema.minItems != undefined ) {
                if ( data.length < schema.minItems ) {
                    error = (new ValidationError( "Array is too short (" + data.length + "), minimum " + schema.minItems )).prefixWith( null, "minItems" );
                    errors.push( error );
                    return error;
                }
            }
            if ( schema.maxItems != undefined ) {
                if ( data.length > schema.maxItems ) {
                    error = (new ValidationError( "Array is too long (" + data.length + " chars), maximum " + schema.maxItems )).prefixWith( null, "maxItems" );
                    errors.push( error );
                    return error;
                }
            }
            return null;
        }

        function validateArrayUniqueItems( data, schema, errors ) {
            if ( schema.uniqueItems ) {
                for ( var i = 0; i < data.length; i++ ) {
                    for ( var j = i + 1; j < data.length; j++ ) {
                        if ( recursiveCompare( data[i], data[j] ) ) {
                            var error = (new ValidationError( "Array items are not unique (indices " + i + " and " + j + ")" )).prefixWith( null, "uniqueItems" );
                            errors.push( error );
                            return error;
                        }
                    }
                }
            }
            return null;
        }

        function validateArrayItems( data, schema, getSchema, errors ) {
            if ( schema.items == undefined ) {
                return null;
            }
            var i, error;
            if ( Array.isArray( schema.items ) ) {
                for ( i = 0; i < data.length; i++ ) {
                    if ( i < schema.items.length ) {
                        if ( error = validateAll( data[i], schema.items[i], getSchema, errors ) ) {
                            return error.prefixWith( null, "" + i ).prefixWith( "" + i, "items" );
                        }
                    } else if ( schema.additionalItems != undefined ) {
                        if ( typeof schema.additionalItems == "boolean" ) {
                            if ( !schema.additionalItems ) {
                                var newError = (new ValidationError( "Additional items not allowed" )).prefixWith( "" + i, "additionalItems" );
                                errors.push( newError );
                                return newError;
                            }
                        } else if ( error = validateAll( data[i], schema.additionalItems, getSchema, errors ) ) {
                            return error.prefixWith( "" + i, "additionalItems" );
                        }
                    }
                }
            } else {
                for ( i = 0; i < data.length; i++ ) {
                    if ( error = validateAll( data[i], schema.items, getSchema, errors ) ) {
                        return error.prefixWith( "" + i, "items" );
                    }
                }
            }
            return null;
        }

        function validateObject( data, schema, getSchema, errors ) {
            if ( typeof data != "object" || data == null || Array.isArray( data ) ) {
                return null;
            }
            return validateObjectMinMaxProperties( data, schema, errors )
                || validateObjectRequiredProperties( data, schema, errors )
                || validateObjectProperties( data, schema, getSchema, errors )
                || validateObjectDependencies( data, schema, getSchema, errors )
                || null;
        }

        function validateObjectMinMaxProperties( data, schema, errors ) {
            var error;
            var keys = Object.keys( data );
            if ( schema.minProperties != undefined ) {
                if ( keys.length < schema.minProperties ) {
                    error = new ValidationError( "Too few properties defined (" + keys.length + "), minimum " + schema.minProperties ).prefixWith( null, "minProperties" );
                    errors.push( error );
                    return error;
                }
            }
            if ( schema.maxProperties != undefined ) {
                if ( keys.length > schema.maxProperties ) {
                    error = new ValidationError( "Too many properties defined (" + keys.length + "), maximum " + schema.maxProperties ).prefixWith( null, "maxProperties" );
                    errors.push( error );
                    return error;
                }
            }
            return null;
        }

        function validateObjectRequiredProperties( data, schema, errors ) {
            if ( schema.required != undefined ) {
                for ( var i = 0; i < schema.required.length; i++ ) {
                    var key = schema.required[i];
                    if ( data[key] === undefined ) {
                        var error = new ValidationError( "Missing required property: " + key ).prefixWith( null, "" + i ).prefixWith( null, "required" );
                        errors.push( error );
                        return error
                    }
                }
            }
            return null;
        }

        function validateObjectProperties( data, schema, getSchema, errors ) {
            var error;
            for ( var key in data ) {
                var foundMatch = false;
                if ( schema.properties != undefined && schema.properties[key] != undefined ) {
                    foundMatch = true;
                    if ( error = validateAll( data[key], schema.properties[key], getSchema, errors ) ) {
                        return error.prefixWith( key, key ).prefixWith( null, "properties" );
                    }
                }
                if ( schema.patternProperties != undefined ) {
                    for ( var patternKey in schema.patternProperties ) {
                        var regexp = new RegExp( patternKey );
                        if ( regexp.test( key ) ) {
                            foundMatch = true;
                            if ( error = validateAll( data[key], schema.patternProperties[patternKey], getSchema, errors ) ) {
                                return error.prefixWith( key, patternKey ).prefixWith( null, "patternProperties" );
                            }
                        }
                    }
                }
                if ( !foundMatch && schema.additionalProperties != undefined ) {
                    if ( typeof schema.additionalProperties == "boolean" ) {
                        if ( !schema.additionalProperties ) {
                            var newError = new ValidationError( "Additional properties not allowed" ).prefixWith( key, "additionalProperties" );
                            errors.push( newError );
                            return newError;
                        }
                    } else {
                        if ( error = validateAll( data[key], schema.additionalProperties, getSchema, errors ) ) {
                            return error.prefixWith( key, "additionalProperties" );
                        }
                    }
                }
            }
            return null;
        }

        function validateObjectDependencies( data, schema, getSchema, errors ) {
            var error, newError;
            if ( schema.dependencies != undefined ) {
                for ( var depKey in schema.dependencies ) {
                    if ( data[depKey] !== undefined ) {
                        var dep = schema.dependencies[depKey];
                        if ( typeof dep == "string" ) {
                            if ( data[dep] === undefined ) {
                                newError = new ValidationError( "Dependency failed - key must exist: " + dep ).prefixWith( null, depKey ).prefixWith( null, "dependencies" );
                                errors.push( newError );
                                return newError;
                            }
                        } else if ( Array.isArray( dep ) ) {
                            for ( var i = 0; i < dep.length; i++ ) {
                                var requiredKey = dep[i];
                                if ( data[requiredKey] === undefined ) {
                                    newError = new ValidationError( "Dependency failed - key must exist: " + requiredKey ).prefixWith( null, "" + i ).prefixWith( null, depKey ).prefixWith( null, "dependencies" );
                                    errors.push( newError );
                                    return newError;
                                }
                            }
                        } else {
                            if ( error = validateAll( data, dep, getSchema, errors ) ) {
                                return error.prefixWith( null, depKey ).prefixWith( null, "dependencies" );
                            }
                        }
                    }
                }
            }
            return null;
        }

        function validateCombinations( data, schema, getSchema, errors ) {
            return validateAllOf( data, schema, getSchema, errors )
                || validateAnyOf( data, schema, getSchema, errors )
                || validateOneOf( data, schema, getSchema, errors )
                || validateNot( data, schema, getSchema, errors )
                || null;
        }

        function validateAllOf( data, schema, getSchema, errors ) {
            if ( schema.allOf == undefined ) {
                return null;
            }
            var error;
            for ( var i = 0; i < schema.allOf.length; i++ ) {
                var subSchema = schema.allOf[i];
                if ( error = validateAll( data, subSchema, getSchema, errors ) ) {
                    return error.prefixWith( null, "" + i ).prefixWith( null, "allOf" );
                }
            }
            return null;
        }

        function validateAnyOf( data, schema, getSchema, errors ) {
            if ( schema.anyOf == undefined ) {
                return null;
            }
            var subErrors = [];
            for ( var i = 0; i < schema.anyOf.length; i++ ) {
                var subSchema = schema.anyOf[i];
                var error = validateAll( data, subSchema, getSchema, [] );
                if ( !error ) {
                    return null;
                }
                subErrors.push( error.prefixWith( null, "" + i ).prefixWith( null, "anyOf" ) );
            }
            var newError = new ValidationError( "Data does not match any schemas from \"anyOf\"", "", "/anyOf", subErrors );
            errors.push( newError );
            return newError;
        }

        function validateOneOf( data, schema, getSchema, errors ) {
            if ( schema.oneOf == undefined ) {
                return null;
            }
            var newError;
            var validIndex = null;
            var subErrors = [];
            for ( var i = 0; i < schema.oneOf.length; i++ ) {
                var subSchema = schema.oneOf[i];
                var error = validateAll( data, subSchema, getSchema, [] );
                if ( error == null ) {
                    if ( validIndex == null ) {
                        validIndex = i;
                    } else {
                        newError = new ValidationError( "Data is valid against more than one schema from \"oneOf\": indices " + validIndex + " and " + i, "", "/oneOf" );
                        errors.push( newError );
                        return newError;
                    }
                } else {
                    subErrors.push( error.prefixWith( null, "" + i ).prefixWith( null, "oneOf" ) );
                }
            }
            if ( validIndex == null ) {
                newError = new ValidationError( "Data does not match any schemas from \"oneOf\"", "", "/oneOf", subErrors );
                errors.push( newError );
                return newError;
            }
            return null;
        }

        function validateNot( data, schema, getSchema, errors ) {
            if ( schema.not == undefined ) {
                return null;
            }
            var error = validateAll( data, schema.not, getSchema, [] );
            if ( error == null ) {
                var newError = new ValidationError( "Data matches schema from \"not\"", "", "/not" );
                errors.push( newError );
                return newError
            }
            return null;
        }

    }

    // Constructor initialization
    if ( arguments.length === 1 ) addSchema( null, url );
    if ( arguments.length === 2 ) addSchema( url, schema );

    return {
        addSchema : addSchema,
        generate : generate,
        getSchema : getSchema,
        normSchema : normSchema,
        validate : validate
    }
};

var exports = exports || {};
exports.JsonSchema = JsonSchema;



