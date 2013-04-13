describe( 'JsonSchema will validate an instance against a negative (not) schema', function () {
    var js;
    beforeEach( function () {
        js = new JsonSchema();
    } );

    it( 'will accept instance if it does not match the schema', function () {
        var data = 5;
        var schema = {
            "not": {"type": "string"}
        };
        var result = js.validate(data, schema);
        expect( result.valid ).toBe( true );
    } );

    it( 'will reject instance if it does not match the schema', function () {
        var data = "test";
        var schema = {
            "not": {"type": "string"}
        };
        var result = js.validate(data, schema);
        expect( result.valid ).not.toBe( true );
    } );
} );
