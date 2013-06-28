# Tiny Validator (for v4 JSON Schema)

[![Build Status](https://secure.travis-ci.org/geraintluff/tv4.png?branch=master)](http://travis-ci.org/geraintluff/tv4) [![Dependency Status](https://gemnasium.com/geraintluff/tv4.png)](https://gemnasium.com/geraintluff/tv4) [![NPM version](https://badge.fury.io/js/tv4.png)](http://badge.fury.io/js/tv4)

All you need is ```tv4.js``` (24KB) or ```tv4.min.js``` (12.9KB, 3.8KB gzipped).

There is support for `$ref` with JSON Pointer fragment paths (```other-schema.json#/properties/myKey```).

## Usage 1:

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

If schemas are referenced (```$ref```) but not known, then validation will return ```true``` and the missing schema(s) will be listed in ```tv4.missing```.

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

Normally, `tv4` stops when it encounters the first validation error.  However, you can collect an array of validation errors using 

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

## Packages using tv4

* [chai-json-schema](http://chaijs.com/plugins/chai-json-schema) is a [Chai Assertion Library](http://chaijs.com) plugin to assert values against json-schema.
* [grunt-tv4](http://www.github.com/Bartvds/grunt-tv4) is a plugin for [grunt](http://http://gruntjs.com/) that uses tv4 to validate json files.

## License

The code is available as "public domain", meaning that it is completely free to use, without any restrictions at all.  Read the full license [here](http://geraintluff.github.com/tv4/LICENSE.txt).

It's also available under an (MIT license](http://jsonary.com/LICENSE.txt).
