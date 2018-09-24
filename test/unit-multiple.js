
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
                },
                "main": {
                  "$id": "/properties/main",
                  "type": "object",
                  "properties": {
                    "url": {
                      "$id": "/properties/main/properties/url",
                      "type": "string",
                      "title": "The Url Schema ",
                      "default": "",
                      "examples": [
                        "/content/en.html"
                      ]
                    }
                  }
                },
                "allimages": {
                  "$id": "/properties/allimages",
                  "type": "array",
                  "items": {
                    "$id": "/properties/allimages/items",
                    "type": "object",
                    "properties": {
                      "url": {
                        "$id": "/properties/allimages/items/properties/url",
                        "type": "string",
                        "title": "The Url Schema ",
                        "default": "",
                        "examples": [
                          "/content/en.html"
                        ]
                      }
                    }
                  }
                },
                "left": {
                  "$id": "/properties/left",
                  "type": "object",
                  "properties": {
                    "url": {
                      "$id": "/properties/left/properties/url",
                      "type": "string",
                      "title": "The Url Schema ",
                      "default": "",
                      "examples": [
                        "/content/en.html"
                      ]
                    }
                  }
                }
              }
            }
          }
var data = {
            "checked": false,
            "id": 1,
            "name": "A green door",
            "main": {
              "url": "/content/en.html"
            },
            "allimages": [{
              "url": "/content/en.html"
            }],
            "left": {
              "url": "/content/en.html"
            }
            
          }
//tv4.addSchema(schema);
var result = tv4.validateMultiple(data, schema, "Body", true, true);

console.log(result);
