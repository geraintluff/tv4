describe( 'JsonSchema will validate min/max values and', function () {
    var js;

    beforeEach(function() {
        js = new JsonSchema();
    });

    it( 'will accept an instance number is greater than a minimum value', function () {
        var result = js.validate( 5, {minimum : 2.5} );
        expect( result.valid ).toBe( true );
    } );

    it( 'will accept an instance number that is equal to the minimum value', function () {
        var result = js.validate( 5, {minimum : 5} );
        expect( result.valid ).toBe( true );
    } );

    it( 'will reject an instance number that is less than the minimum value', function () {
        var result = js.validate( 5, {minimum : 6} );
        expect( result.valid ).not.toBe( true );
    } );

    it( 'will accept an instance number is greater than an exclusive minimum value', function () {
        var result = js.validate( 5, {minimum : 2.5, exclusiveMinimum: true} );
        expect( result.valid ).toBe( true );
    } );

    it( 'will accept an instance number that is equal to an exclusive minimum value', function () {
        var result = js.validate( 5, {minimum : 5, exclusiveMinimum: true} );
        expect( result.valid ).not.toBe( true );
    } );

    it( 'will reject an instance number that is less than an exclusive minimum value', function () {
        var result = js.validate( 5, {minimum : 6, exclusiveMinimum: true} );
        expect( result.valid ).not.toBe( true );
    } );

    it( 'will accept an instance number is greater than a maximum value', function () {
        var result = js.validate( 2.5, {maximum : 5} );
        expect( result.valid ).toBe( true );
    } );

    it( 'will accept an instance number that is equal to the maximum value', function () {
        var result = js.validate( 5, {maximum : 5} );
        expect( result.valid ).toBe( true );
    } );

    it( 'will reject an instance number that is less than the maximum value', function () {
        var result = js.validate( 7, {maximum : 5} );
        expect( result.valid ).not.toBe( true );
    } );

    it( 'will accept an instance number is greater than an exclusive maximum value', function () {
        var result = js.validate( 3, {maximum : 5, exclusiveMaximum: true} );
        expect( result.valid ).toBe( true );
    } );

    it( 'will accept an instance number that is equal to an exclusive maximum value', function () {
        var result = js.validate( 5, {maximum : 5, exclusiveMaximum: true} );
        expect( result.valid ).not.toBe( true );
    } );

    it( 'will reject an instance number that is less than an exclusive maximum value', function () {
        var result = js.validate( 7, {maximum : 5, exclusiveMaximum: true} );
        expect( result.valid ).not.toBe( true );
    } );
} );

