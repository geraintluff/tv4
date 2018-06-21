
var tv4 = require('../tv4');
  
var schema = {
"Body": {
  "$id": "http://example.com/example.json",
  "type": "object",
  "definitions": {},
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "checked": {
      "$id": "/properties/checked",
      "type": "boolean",
      "title": "The Checked Schema ",
      "default": false,
      "examples": [
        false
      ]
    },
    "id": {
      "$id": "/properties/id",
      "type": "integer",
      "title": "The Id Schema ",
      "default": 0,
      "examples": [
        1
      ]
    },
    "name": {
      "$id": "/properties/name",
      "type": "string",
      "title": "The Name Schema ",
      "default": "",
      "examples": [
        "A green door"
      ]
    }
  }
}
}
var data = {
        "checked": false,
        "id": 1,
        "name": "A green door"
      }
//tv4.addSchema(schema);
var result = tv4.validateMultiple(data, schema, "Body", true, true);

console.log(result);
