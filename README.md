#Tiny Validator (for v4 JSON Schema)

All you need is ```tv4.js``` (17kb) or ```tv4.min.js``` (8.3kb, 2.9kb gzipped).

There is support for `$ref` with JSON Pointer fragment paths (```other-schema.json#/properties/myKey```).

## Usage

```javascript
var valid = tv4.validate(data, schema);
```

If validation returns ```false```, then an explanation of why validation failed can be found in ```tv4.error```.

The error object will look something like:
```json
{
    "message": "Invalid type: string",
    "dataPath": "/intKey",
    "schemaKey": "/properties/intKey/type"
}
```

To enable external schema to be referenced, you use:
```javascript
tv4.addSchema(url, schema);
```

If schemas are referenced (```$ref```) but not known, then validation will return ```true``` and the missing schema(s) will be listed in ```tv4.missing```.

## Asynchronous validation

Support for asynchronous validation (where missing schemas are fetched) can be added by including an extra JavaScript file.  Currently, the only version requires jQuery (`tv4.async-jquery.js`), but the code is very short and should be fairly easy to modify for other libraries (such as MooTools).

Usage:

```javascript
tv4.validate(data, schema, function (isValid, validationError) { ... });
```

`validationFailure` is simply taken from `tv4.error`. 

## Tests

There are tests available, but they require PHP, so you can't see them on GitHub.

## Minifying

```tv4.min.js``` is produced using the [Google Closure Compiler](http://closure-compiler.appspot.com/home).

## License

The code is available as "public domain", meaning that it is completely free to use, without any restrictions at all.  Read the full license (here)[http://geraintluff.github.com/tv4/LICENSE.txt].
