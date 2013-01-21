#Tiny Validator (for v4 JSON Schema)

All you need is ```tv4.js```.

Currently no support for `$ref`, but all other validation keywords supported.

## Usage

```javascript
var valid = validate(data, schema);
```

If validation returns ```false```, then there will be an property of the validation function (```validate.error```) explaining why validation failed.

The error object will look something like:
```json
{
    "message": "Invalid type: string",
    "dataPath": "/intKey",
    "schemaKey": "/properties/intKey/type"
}
```


## Tests

There are tests available, but they require PHP, so you can't see them on GitHub.
