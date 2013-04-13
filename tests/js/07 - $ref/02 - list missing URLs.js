describe( 'JsonSchema will keep track of missing schemas and', function () {
    var js;
    beforeEach( function () {
        js = new JsonSchema();
    } );

    it( 'will not report a schema missing if it is not used during validation', function () {
        var schema = {
            "items" : {"$ref" : "http://example.com/schema#"}
        };
        var result = js.validate( [], schema );
        expect( result.valid ).toBe( true );
    } );

    it( 'will not report a schema missing if it is not used during validation', function () {
        var schema = {
            "items" : {"$ref" : "http://example.com/schema#"}
        };
        var result = js.validate( [1, 2, 3], schema );
        expect( result.valid ).toBe( true );
        expect( result.isMissing( 'http://example.com/schema' ) ).toBe( true );
    } );
} );
