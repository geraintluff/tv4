describe( 'JsonSchema will validate the items to ensure the schemas align with the indexed array values and', function () {
    var js;
    beforeEach( function () {
        js = new JsonSchema();
    } );

    it( 'will accept array indexed values that match schemas in items array', function () {
        var data = [1, true, "one"];
        var schema = {
            "items": [
                {"type": "integer"},
                {"type": "boolean"}
            ]
        };
        var result = js.validate( data, schema );
        expect( result.valid ).toBe( true );
    } );

    it( 'will reject array indexed values that do not match schemas in items array', function () {
        var data = [1, "one", true];
        var schema = {
            "items": [
                {"type": "integer"},
                {"type": "boolean"}
            ]
        };
        var result = js.validate( data, schema );
        expect( result.valid ).not.toBe( true );
    } );
} );
