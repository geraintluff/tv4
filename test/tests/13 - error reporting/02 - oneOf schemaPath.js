describe("Valid schemaPath for \"oneOf\" (GitHub Issue #117)", function () {
    it("valid schemaPath in error (simple types)", function () {
        var data = {};
        var schema = {
            "oneOf": [
                { "type": "string" },
                { "type": "bool" }
            ]
        };
        
        var result = tv4.validateMultiple(data, schema);
        var suberr = result.errors[0].subErrors;
        assert.equal(suberr[0].schemaPath, '/oneOf/0/type');
        assert.equal(suberr[1].schemaPath, '/oneOf/1/type');
    });
    
    it("valid schemaPath in error (required properties)", function () {
        /* Test case provided on GitHub Issue #117 */
        var data = {};
        var schema = {
            "$schema": "http://json-schema.org/draft-04/schema#",
            "oneOf": [
                {
                    "type": "object",
                    "properties": {
                        "data": {
                            "type": "object"
                        }
                    },
                    "required": ["data"]
                },
                {
                    "type": "object",
                    "properties": {
                        "error": {
                            "type": "object"
                        }
                    },
                    "required": ["error"]
                }
            ]
        };
        
        var result = tv4.validateMultiple(data, schema);
        var suberr = result.errors[0].subErrors;
        assert.equal(suberr[0].schemaPath, "/oneOf/0/required/0");
        assert.equal(suberr[1].schemaPath, "/oneOf/1/required/0");
    });
});
