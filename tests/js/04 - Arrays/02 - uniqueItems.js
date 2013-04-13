describe( 'JsonSchema will validate that the items in an array are unique and', function () {
    var js;
    beforeEach( function () {
        js = new JsonSchema();
    } );

    it( 'will accept any items in an array when there is no uniqueItems in schema', function () {
        var result = js.validate( [1, true, '1', 1], {type : 'array'} );
        expect( result.valid ).toBe( true );
    } );

    it( 'will accept a unique collection of array elements with uniqueItems', function () {
        var result = js.validate( [1, true, '1'], {type : 'array', uniqueItems : true} );
        expect( result.valid ).toBe( true );
    } );

    it( 'will reject a non-unique collection of array elements with uniqueItems', function () {
        var result = js.validate( [1, true, '1', 1], {type : 'array', uniqueItems : true} );
        expect( result.valid ).not.toBe( true );
    } );

} );
