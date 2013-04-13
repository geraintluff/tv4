describe( 'JsonSchema can validate string values against regex patterns and', function () {
    var js;
    beforeEach( function () {
        js = new JsonSchema();
    } );

    it( 'will accept strings that match a particular regex pattern', function () {
        var result = js.validate( '9test', {"pattern" : "^[0-9][a-zA-Z]*$"} );
        expect( result.valid ).toBe( true );
    } );

    it( 'will reject strings that do not match a particular regex pattern', function () {
        var result = js.validate( '9test9', {"pattern" : "^[0-9][a-zA-Z]*$"} );
        expect( result.valid ).not.toBe( true );
    } );

} );
