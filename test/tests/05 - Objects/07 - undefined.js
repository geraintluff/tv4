describe("Objects 07", function() {
    it("validate an optional undefined property", function () {
        var data = {optional: undefined};
        var schema = {
            properties: {
                optional: {"type": "string"},
            }
        };
        var valid = tv4.validate(data, schema);
        assert.isTrue(valid);
    });

    it("does not validate a undefined required property", function () {
        var data = {required: undefined};
        var schema = {
            properties: {
                required: {"type": "string"}
            },
            required: ['required']
        };
        var valid = tv4.validate(data, schema);
        assert.isFalse(valid);
    });
});
