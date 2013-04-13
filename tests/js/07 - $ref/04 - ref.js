describe( 'JsonSchema will resolve schema references and', function () {

    it( 'will validate against an external schema', function () {
        var url = "http://example.com/schema" + Math.random();
        var schema = {
            "test" : "value"
        };

        var js = new JsonSchema( url, schema );

        var otherSchema = {
            "items" : {"$ref" : url}
        };

        var result = js.validate( [0, 1, 2, 3], otherSchema );
        expect( result.valid ).toBe( true );
    } );

    it( 'will validate a a self-referencing nested schema', function () {
        var schema = {
            "type" : "array",
            "items" : {"$ref" : "#"}
        };

        var js = new JsonSchema();

        var result = js.validate( [ [], [ [] ] ], schema );
        expect( result.valid ).toBe( true );

        result = js.validate( [0, 1, 2, 3], schema );
        expect( result.valid ).not.toBe( true );

        result = js.validate( [
            [true],
            []
        ], schema );
        expect( result.valid ).not.toBe( true );
    } );
} );
