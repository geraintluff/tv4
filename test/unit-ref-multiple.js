
var tv4 = require('../tv4');
	
var swaggerData = {
              "Account": {
                "type": "object",
                "properties": {
                  "accountId": {
                    "type": "string",
                    "description": "The account ID"
                  },
                  "name": {
                    "type": "string",
                    "description": "The name of the account"
                  }
                }
              },
              "AccountId": {
                "type": "object",
                "properties": {
                  "accountId": {
                    "type": "string",
                    "description": "The account ID"
                  }
                }
              },
              "Accounts": {
                "type": "array",
                "items": {
                  "$ref": "#/definitions/Account"
                }
              },
              "Products": {
                "type": "array",
                "items": {
                  "$ref": "#/definitions/Product"
                }
              },
              "Product": {
                "type": "object",
                "properties": {
                  "name": {
                    "type": "string",
                    "description": "The canonical name of the asset pair (i.e. BTC_EUR)"
                  },
                  "productId": {
                    "type": "string",
                    "description": "A unique identifier for this product"
                  },
                  "precision": {
                    "type": "integer",
                    "description": "The price precision for this product"
                  },
                  "pair": {
                    "$ref": "#/definitions/Pair"
                  }
                }
              },
              "Asset": {
                "type": "object",
                "discriminator": "assetType"
              },
              "Fiat": {
                "allOf": [{
                    "$ref": "#/definitions/Asset"
                  },
                  {
                    "type": "object",
                    "properties": {
                      "symbol": {
                        "type": "string",
                        "description": "The asset symbol.",
                        "enum": [
                          "EUR",
                          "USD"
                        ]
                      }
                    }
                  }
                ]
              },
              "Token": {
                "allOf": [{
                    "$ref": "#/definitions/Asset"
                  },
                  {
                    "type": "object",
                    "properties": {
                      "symbol": {
                        "type": "string",
                        "description": "The asset symbol.",
                        "enum": [
                          "BTC",
                          "ETH",
                          "LTC"
                        ]
                      }
                    }
                  }
                ]
              },
              "Pair": {
                "type": "object",
                "properties": {
                  "from": {
                    "$ref": "#/definitions/Asset"
                  },
                  "to": {
                    "$ref": "#/definitions/Asset"
                  }
                },
                "example": [{
                  "name": "BTC_EUR",
                  "productId": "99d40b2f-1447-4893-8bfe-b854836f8555",
                  "pair": {
                    "from": {
                      "asset": {
                        "symbol": "BTC",
                        "type": "TOKEN"
                      }
                    },
                    "to": {
                      "asset": {
                        "symbol": "EUR",
                        "type": "FIAT"
                      }
                    }
                  }
                }]
              }
            }

  function fixSchemaRefs (schema, swagData) {
        
        for (var prop in schema) {
            if(typeof(schema[prop]) === "string"){
                if(prop === '$ref'){
                    schema = swagData[schema[prop].replace('#/definitions/', '')]
                    return schema;
                }
            }else{
                schema[prop] = fixSchemaRefs(schema[prop], swagData)
            }
        }
        return schema
    }
    function setSchemas (swag) {
        
        var definitions = {}
        for (var schema in swag) {
            definitions[schema] = fixSchemaRefs(swag[schema], swag)
                }
        return swag;
    }

var schema = setSchemas(swaggerData);
var data = [
              {
                "name": "BTC_EUR",
                "productId": "99d40b2f-1447-4893-8bfe-b854836f8555",
                "pair": {
                  "from": {
                    "asset": {
                      "symbol": "BTC",
                      "type": "TOKEN"
                    }
                },
                  "to": {
                    "asset": {
                      "symbol": "EUR",
                      "type": "FIAT"
                    }
                  }
                }
              }
            ]
//tv4.addSchema(schema);
var result = tv4.validateMultiple(data, schema["Products"], true, true);

console.log(result);
