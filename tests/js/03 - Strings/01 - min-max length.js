describe( 'JsonSchema will verify a strings length and', function () {
    var js;

    beforeEach(function() {
        js = new JsonSchema();
    });

    it( 'will accept a string value with no length constraints', function () {
        var result = js.validate( 'test', {"type" : "string"} );
        expect( result.valid ).toBe( true );
    } );

    it( 'will accept a string length greater than a minimum length constraint', function () {
        var result = js.validate( 'test', {type : 'string', minLength : 3} );
        expect( result.valid ).toBe( true );
    } );

    it( 'will accept a string length the same as a minimum length constraint', function () {
        var result = js.validate( 'test', {type : 'string', minLength : 4} );
        expect( result.valid ).toBe( true );
    } );

    it( 'will reject a string length greater than a maximum length constraint', function () {
        var result = js.validate( 'test', {type : 'string', maxLength : 3} );
        expect( result.valid ).not.toBe( true );
    } );

    it( 'will accept a string length the same as a maximum length constraint', function () {
        var result = js.validate( 'test', {type : 'string', maxLength : 4} );
        expect( result.valid ).toBe( true );
    } );

    it( 'will accept a string length less than a maximum length constraint', function () {
        var result = js.validate( 'test', {type : 'string', maxLength : 5} );
        expect( result.valid ).toBe( true );
    } );
} );
