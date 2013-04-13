describe( 'JsonSchema will validate an instance against multiple schemas and', function () {
    var js;
    beforeEach( function () {
        js = new JsonSchema();
    } );

    it( 'will accept the instance if all of the schemas are satisfied', function () {
        var data = 10;
        var schema = {
            "allOf" : [
                {"type" : "integer"},
                {"minimum" : 5}
            ]
        };
        var result = js.validate( data, schema );
        expect( result.valid ).toBe( true );
    } );

    it( 'will reject the instance if any of the schemas fail', function () {
        var data = 1;
        var schema = {
            "allOf" : [
                {"type" : "integer"},
                {"minimum" : 5}
            ]
        };
        var result = js.validate( data, schema );
        expect( result.valid ).not.toBe( true );
    } );
} );
