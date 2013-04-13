describe( 'The JsonSchema class', function () {

    it( 'can be discovered', function () {
        expect( JsonSchema ).toBeDefined();
    } );

    it( 'can be instantiated with no parameters', function () {
        expect( new JsonSchema() ).toBeDefined();
    } );

    it( 'can be instantiated with a schema object', function () {
        expect( new JsonSchema( {} ) ).toBeDefined();
    } );

    it( 'can be instantiated with an array of schema objects', function () {
        var js = new JsonSchema( [
            {},
            {"type" : "object"}
        ] );
        expect( js ).toBeDefined();
    } );

} );