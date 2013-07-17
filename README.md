# Tiny Validator (for v4 JSON Schema)

[![Build Status](https://secure.travis-ci.org/geraintluff/tv4.png?branch=master)](http://travis-ci.org/geraintluff/tv4) [![Dependency Status](https://gemnasium.com/geraintluff/tv4.png)](https://gemnasium.com/geraintluff/tv4) [![NPM version](https://badge.fury.io/js/tv4.png)](http://badge.fury.io/js/tv4)

Use [json-schema](http://json-schema.org/) [draft v4](http://json-schema.org/latest/json-schema-core.html) to validate simple values and complex objects against the rich collection of IETF standardised [validation terms](http://json-schema.org/latest/json-schema-validation.html) ([examples](http://json-schema.org/examples.html)). 

There is support for `$ref` with JSON Pointer fragment paths (```other-schema.json#/properties/myKey```).

## Usage 1: Simple validation

```javascript
var valid = tv4.validate(data, schema);
```

If validation returns ```false```, then an explanation of why validation failed can be found in ```tv4.error```.

The error object will look something like:
```json
{
    "code": 0,
    "message": "Invalid type: string",
    "dataPath": "/intKey",
    "schemaKey": "/properties/intKey/type"
}
```

The `"code"` property will refer to one of the values in `tv4.errorCodes` - in this case, `tv4.errorCodes.INVALID_TYPE`.

To enable external schema to be referenced, you use: 
```javascript
tv4.addSchema(url, schema);
```

If schemas are referenced (```$ref```) but not known, then validation will return ```true``` and the missing schema(s) will be listed in ```tv4.missing```. For more info see the **api** documentation below.

## Usage 2: Multi-threaded validation

Storing the error and missing schemas does not work well in multi-threaded environments, so there is an alternative syntax:

```javascript
var result = tv4.validateResult(data, schema);
```

The result will look something like:
```json
{
    "valid": false,
    "error": {...},
    "missing": [...]
}
```

## Usage 3: Multiple errors

Normally, `tv4` stops when it encounters the first validation error.  However, you can collect an array of validation errors using:

```javascript
var result = tv4.validateMultiple(data, schema);
```

The result will look something like:
```json
{
    "valid": false,
    "errors": [
        {...},
        ...
    ],
    "missing": [...]
}
```

## Asynchronous validation

Support for asynchronous validation (where missing schemas are fetched) can be added by including an extra JavaScript file.  Currently, the only version requires jQuery (`tv4.async-jquery.js`), but the code is very short and should be fairly easy to modify for other libraries (such as MooTools).

Usage:

```javascript
tv4.validate(data, schema, function (isValid, validationError) { ... });
```

`validationFailure` is simply taken from `tv4.error`. 

## API

Additional api commands:

##### addSchema(uri, schema)
Pre-register a schema for reference by other schema and synchronous validation:

````js
tv4.addSchema('http://example.com/schema', { ... });
````

* `uri` the uri to identify this schema.
* `schema` the schema object.

Schema's that have their `id` property set can be added directly:

````js
tv4.addSchema({ ... });
````

##### getSchema(uri)

Return a schema from the cache matching the uri. Returns the schema object or `undefined`:

* `uri` the uri of the schema (may contain a `#` fragment)

````js
var schema = tv4.getSchema('http://example.com/schema');
````

##### getSchemaMap()

Return a shallow copy of the schema cache object, mapping schema document uri's to schema objects:

````
var map = tv4.getSchemaMap();

var schema = map[url];
````

##### getSchemaUris(filter)

Return an Array with added schema document uri's: 

* `filter` optional RegExp to filter uri's

````
var arr = tv4.getSchemaUris();

// optional filter using a RegExp
var arr = tv4.getSchemaUris(/^https?://example.com/);
````

##### getMissingUris(filter)

Return an Array with schema document url's that are used as `$ref` that currenlty have no associated schema data. 

Use this in combination with `tv4.addSchema(url, schema)` to preload for complete synchronous validation.

* `filter` optional RegExp to filter uri's

````
var arr = tv4.getMissingUris();

// optional filter using a RegExp
var arr = tv4.getMissingUris(/^https?://example.com/);
````

##### dropSchemas()

Drop all known schema document url's from the cache.

````
tv4.dropSchemas();
````

##### freshApi()

Return a new tv4 instance with no shared state.

````
var otherTV4 = tv4.freshApi();
````

##### reset()

Manually reset validation status from the simple `tv4.validate(data, schema)`. Although tv4 will self reset on each validation there are some implementation scenario's where this is useful.

````
tv4.reset();
````

##### language(code)

Select the language map used for reporting.

* `code` is a langauge code, currently supports `'en'` and `'en-gb'`

````
tv4.language('en-gb');
````

##### addLanguage(code, map)

Add a new language map for selection by `tv4.language(code)`

* `code` is new language code
* `map` is an object mapping error id's to language strings.

````
tv4.addLanguage('fr', { ... });

// select for use
tv4.language('fr')
````

## Installation

### Manual

All you need is ```tv4.js``` or the minified ```tv4.min.js```. Include them as `<script>` your html and the global `tv4` variable will be available.

### From a package manager:

Expose `tv4` as a CommonJS module and a browser global.

````js
var tv4 = require('tv4').tv4;
````

#### npm

````
$ npm install tv4
````

#### bower

````
$ bower install tv4
````

#### component.io

````
$ component install geraintluff/tv4
````

## Build and test

You can rebuild and run the node and browser tests using node.js and [grunt](http://http://gruntjs.com/):

Make sure you have the global grunt cli command:
````	
$ npm install grunt-cli -g
````

Navigate to your tv4 git checkout and install the development dependencies:

````
$ npm install
````

Rebuild and run the tests:
````
$ grunt
````

It will run a build and display one Spec-style report for the node.js and two Dot-style reports for the plain and minified browser tests running in phantomJS. You can also use a browser to manually run the suites by opening `test/index.html` and `test/index-min.html`.

## Packages using tv4

* [chai-json-schema](http://chaijs.com/plugins/chai-json-schema) is a [Chai Assertion Library](http://chaijs.com) plugin to assert values against json-schema.
* [grunt-tv4](http://www.github.com/Bartvds/grunt-tv4) is a plugin for [grunt](http://http://gruntjs.com/) that uses tv4 to bulk validate json files.

## License

The code is available as "public domain", meaning that it is completely free to use, without any restrictions at all.  Read the full license [here](http://geraintluff.github.com/tv4/LICENSE.txt).

It's also available under an [MIT license](http://jsonary.com/LICENSE.txt).
