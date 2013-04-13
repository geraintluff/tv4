describe( 'The schema\'s multipleOf determines that a schema value is a factor of an instance value', function () {

    var js;

    beforeEach(function() {
        js = new JsonSchema();
    });

    it( 'will accept a schema factor of float values', function () {
        var result = js.validate( 5, {"multipleOf": 2.5} );
        expect( result.valid ).toBe( true );
    } );

    it( 'will reject bad schema factor of float values', function () {
        var result = js.validate( 5, {"multipleOf": 0.75} );
        expect( result.valid ).not.toBe( true );
    } );

    it( 'will accept multipleOf schema when applied to non-numeric values', function () {
        var result = js.validate( '50', {"multipleOf": 25} );
        expect( result.valid ).toBe( true );
    } );


} );
