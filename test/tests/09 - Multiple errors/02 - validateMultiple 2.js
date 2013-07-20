describe("Multiple errors 02", function () {

	it("validateMultiple returns array of errors", function () {
		var data = {
			"alternatives": {
				"option1": "pattern for option 1"
			}
		};

		var schema = {
			"type": "object",
			"properties": {
				"alternatives": {
					"type": "object",
					"description": "Some options",
					"oneOf": [
						{
							"properties": {
								"option1": {
									"type": "string",
									"pattern": "^pattern for option 1$"
								}
							},
							"additionalProperties": false,
							"required": [
								"option1"
							]
						},
						{
							"properties": {
								"option2": {
									"type": "string",
									"pattern": "^pattern for option 2$"
								}
							},
							"additionalProperties": false,
							"required": [
								"option2"
							]
						},
						{
							"properties": {
								"option3": {
									"type": "string",
									"pattern": "^pattern for option 3$"
								}
							},
							"additionalProperties": false,
							"required": [
								"option3"
							]
						}
					]
				}
			}
		};
		var result = tv4.validateMultiple(data, schema);

		assert.isTrue(result.valid, "data should be valid");
		assert.length(result.errors, 0, "should have no errors");

		//this.assert(result.valid == true, "data should be valid");
		//this.assert(result.errors.length == 0, "should have no errors");
	});
});