
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
    "ProductId": {
        "type": "object",
        "properties": {
            "productId": {
                "type": "string",
                "description": "The product ID"
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
    "Assets": {
        "type": "array",
        "items": {
            "$ref": "#/definitions/Asset"
        }
    },
    "ProductDefinition": {
        "type": "object",
        "properties": {
            "description": {
                "type": "string",
                "description": "The description of the product"
            },
            "margin": {
                "type": "number",
                "description": "The margin in percentage to apply on a product"
            },
            "conversions": {
                "$ref": "#/definitions/ProductConversions"
            }
        }
    },
    "Product": {
        "type": "object",
        "properties": {
            "productId": {
                "type": "string",
                "description": "A unique identifier for this product"
            },
            "description": {
                "type": "string",
                "description": "The description of the product"
            },
            "margin": {
                "type": "number",
                "description": "The margin in percentage to apply on a product"
            },
            "conversions": {
                "$ref": "#/definitions/ProductConversions"
            }
        }
    },
    "ProductConversions": {
        "type": "array",
        "items": {
            "$ref": "#/definitions/ProductConversion"
        }
    },
    "ProductConversion": {
        "type": "object",
        "properties": {
            "asset": {
                "$ref": "#/definitions/Asset"
            },
            "step": {
                "type": "integer",
                "description": "The step in which it will convert"
            }
        }
    },
    "Asset": {
        "type": "object",
        "discriminator": "assetType",
        "properties": {
            "symbol": {
                "type": "string"
            },
            "longName": {
                "type": "string"
            },
            "precision": {
                "type": "number"
            },
            "minimumQuantity": {
                "type": "number"
            },
            "active": {
                "type": "boolean"
            }
        }
    },
    "Fiat": {
        "allOf": [
            {
                "$ref": "#/definitions/Asset"
            },
            {
                "type": "object"
            }
        ]
    },
    "Token": {
        "allOf": [
            {
                "$ref": "#/definitions/Asset"
            },
            {
                "type": "object"
            }
        ]
    },
    "Symbol": {
        "type": "object",
        "properties": {
            "symbol": {
                "type": "string",
                "example": "EUR",
                "description": "The asset symbol"
            }
        }
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
        "example": [
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
    },
    "Market": {
        "type": "object",
        "properties": {
            "name": {
                "type": "string",
                "description": "The unabreviated name of the market"
            },
            "pair": {
                "$ref": "#/definitions/Pair"
            },
            "quantity": {
                "type": "number",
                "minimum": 0,
                "exclusiveMinimum": true,
                "description": "The amount of FIAT currency per unit token"
            },
            "dateTime": {
                "type": "string",
                "description": "The date and time of the market data"
            },
            "priceChangePercentage": {
                "type": "number",
                "description": "24 hour price difference percentage"
            }
        }
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
    return schema;
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
        "productId": "74de2bb0-6d4c-30e7-b7f3-5e40b2312cd1",
        "description": "EUR_BTC",
        "margin": 0,
        "conversions": [
            {
                "asset": {
                    "assetType": "Fiat",
                    "symbol": "EUR"
                },
                "step": 1
            },
            {
                "asset": {
                    "assetType": "Token",
                    "symbol": "BTC"
                },
                "step": 2
            }
        ]
    }
]
//var test = tv4.validate()
var result = tv4.validateMultiple(data, schema, "Products", true, true, true);


console.log(result);
