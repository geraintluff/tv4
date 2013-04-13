describe( 'JsonSchema will validate the min/max number of elements in an array and', function () {
    var js;
    beforeEach( function () {
        js = new JsonSchema();
    } );

    it( 'will accept any length array when no schema is specified', function () {
        var result = js.validate( [1, 2, 3], { type : 'array'} );
        expect( result.valid ).toBe( true );
    } );

    it( 'will accept an array with more elements than schema minItems', function () {
        var result = js.validate( [1, 2, 3], { type : 'array', minItems : 2} );
        expect( result.valid ).toBe( true );
    } );

    it( 'will accept an array with same number of elements than schema minItems', function () {
        var result = js.validate( [1, 2, 3], { type : 'array', minItems : 3} );
        expect( result.valid ).toBe( true );
    } );

    it( 'will reject an array with less number of elements than schema minItems', function () {
        var result = js.validate( [1, 2, 3], { type : 'array', minItems : 4} );
        expect( result.valid ).not.toBe( true );
    } );

    it( 'will accept an array with less number of elements than schema maxItems', function () {
        var result = js.validate( [1, 2, 3], { type : 'array', maxItems : 4} );
        expect( result.valid ).toBe( true );
    } );

    it( 'will accept an array with same number of elements than schema maxItems', function () {
        var result = js.validate( [1, 2, 3], { type : 'array', maxItems : 3} );
        expect( result.valid ).toBe( true );
    } );

    it( 'will reject an array with more number of elements than schema maxItems', function () {
        var result = js.validate( [1, 2, 3], { type : 'array', maxItems : 2} );
        expect( result.valid ).not.toBe( true );
    } );

} );
