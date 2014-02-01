describe("Issue 86", function () {

	it("Example from GitHub issue #86", function () {
		// The "checkRecursive" flag skips some data nodes if it actually needs to check the same data/schema pair twice
	
		var schema = {
			"type": "object",
			"properties": {
				"shape": {
					"oneOf": [
						{ "$ref": "#/definitions/squareSchema" },
						{ "$ref": "#/definitions/circleSchema" }
					]
				}
			},
			"definitions": {
				"squareSchema": {
					"type": "object",
					"properties": {
						"thetype": {
							"type": "string",
							"enum": ["square"]
						},
						"colour": {},
						"shade": {},
						"boxname": {
							"type": "string"
						}
					},
					"oneOf": [
						{ "$ref": "#/definitions/colourSchema" },
						{ "$ref": "#/definitions/shadeSchema" }
					],
					"required": ["thetype", "boxname"],
					"additionalProperties": false
				},
				"circleSchema": {
					"type": "object",
					"properties": {
						"thetype": {
							"type": "string",
							"enum": ["circle"]
						},
						"colour": {},
						"shade": {}
					},
					"oneOf": [
						{ "$ref": "#/definitions/colourSchema" },
						{ "$ref": "#/definitions/shadeSchema" }
					],
					"additionalProperties": false
				},
				"colourSchema": {
					"type": "object",
					"properties": {
						"colour": {
							"type": "string"
						},
						"shade": {
							"type": "null"
						}
					}
				},
				"shadeSchema": {
					"type": "object",
					"properties": {
						"shade": {
							"type": "string"
						},
						"colour": {
							"type": "null"
						}
					}
				}
			}
		};

	
		var circle = {
			"shape": {
				"thetype": "circle",
				"shade": "red"
			}
		};
		
		var simpleResult = tv4.validate(circle, schema, true);
		var multipleResult = tv4.validateMultiple(circle, schema, true);
		
		assert.isTrue(simpleResult, 'validate() should return valid');
		assert.isTrue(multipleResult.valid, 'validateMultiple() should return valid');
	});

	it("Second example", function () {
		var schema = {
			"allOf": [
				{
					"oneOf": [
						{"$ref": "#/definitions/option1"},
						{"$ref": "#/definitions/option2"},
					]
				},
				{
					"not": {"$ref": "#/definitions/option2"}
				}
			],
			"definitions": {
				"option1": {
					"allOf": [{"type": "string"}]
				},
				"option2": {
					"allOf": [{"type": "number"}]
				}
			}
		};
		
		var simpleResult = tv4.validate("test", schema, true);
		
		assert.isTrue(simpleResult, "validate() should return valid");
	});
});