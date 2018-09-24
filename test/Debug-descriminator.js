
var tv4 = require('../tv4');

var swaggerData = {
    "CryptoExchange": {
        "type": "string",
        "description": "The exchange",
        "enum": [
            "KRAKEN",
            "BINANCE",
            "BITSTAMP"
        ]
    },
    "Exchange": {
        "type": "object",
        "properties": {
            "exchangeId": {
                "type": "string",
                "description": "Identifier of the exchange"
            },
            "cryptoExchange": {
                "$ref": "#/definitions/CryptoExchange"
            },
            "configuration": {
                "$ref": "#/definitions/ExchangeConfiguration"
            }
        }
    },
    "ExchangeConfiguration": {
        "type": "object",
        "properties": {
            "enabled": {
                "type": "boolean",
                "description": "exchange enabled"
            },
            "availablePairs": {
                "type": "array",
                "items": {
                    "$ref": "#/definitions/Pair"
                }
            },
            "orderbookUrl": {
                "type": "string"
            },
            "fixedPollRate": {
                "type": "integer"
            }
        },
        "required": [
            "enabled",
            "availablePairs",
            "orderbookUrl",
            "fixedPollRate"
        ]
    },
    "Asset": {
        "type": "object",
        "discriminator": "assetType"
    },
    "Fiat": {
        "allOf": [
            {
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
        "allOf": [
            {
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
var data = {
    "configuration": {
        "enabled": true,
        "availablePairs": [
            {
                "from": {
                    "assetType": "Token",
                    "symbol": "ETH"
                },
                "to": {
                    "assetType": "Fiat",
                    "symbol": "EUR"
                }
            },
            {
                "from": {
                    "assetType": "Token",
                    "symbol": "BTC"
                },
                "to": {
                    "assetType": "Fiat",
                    "symbol": "EUR"
                }
            },
            {
                "from": {
                    "assetType": "Token",
                    "symbol": "LTC"
                },
                "to": {
                    "assetType": "Fiat",
                    "symbol": "EUR"
                }
            }
        ],
        "orderbookUrl": "https://api.kraken.com/0/public/Depth?pair=",
        "fixedPollRate": 10000
    },
    "exchangeId": "1596be22-0a52-39b5-9742-2dc0a1c18c43",
    "cryptoExchange": "KRAKEN"
}
//var test = tv4.validate()
var result = tv4.validateMultiple(data, schema, "Exchange", true, true, true);


console.log(result);
