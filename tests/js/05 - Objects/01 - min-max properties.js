describe( 'JsonSchema will validate the number of properties on an instance and', function () {
    var js;
    beforeEach( function () {
        js = new JsonSchema();
    } );

    it( 'will allow greater number of properties than specified by minProperties', function () {
        var data = {key1 : 1, key2 : 2, key3 : 3};
        var schema = {minProperties : 2};
        var result = js.validate( data, schema );
        expect( result.valid ).toBe( true );
    } );

    it( 'will allow same number of properties than specified by minProperties', function () {
        var data = {key1 : 1, key2 : 2, key3 : 3};
        var schema = {minProperties : 3};
        var result = js.validate( data, schema );
        expect( result.valid ).toBe( true );
    } );

    it( 'will reject less number of properties than specified by minProperties', function () {
        var data = {key1 : 1, key2 : 2, key3 : 3};
        var schema = {minProperties : 4};
        var result = js.validate( data, schema );
        expect( result.valid ).not.toBe( true );
    } );

    it( 'will allow less number of properties than specified by maxProperties', function () {
        var data = {key1 : 1, key2 : 2, key3 : 3};
        var schema = {maxProperties : 4};
        var result = js.validate( data, schema );
        expect( result.valid ).toBe( true );
    } );

    it( 'will allow same number of properties than specified by maxProperties', function () {
        var data = {key1 : 1, key2 : 2, key3 : 3};
        var schema = {maxProperties : 3};
        var result = js.validate( data, schema );
        expect( result.valid ).toBe( true );
    } );

    it( 'will reject greater number of properties than specified by maxProperties', function () {
        var data = {key1 : 1, key2 : 2, key3 : 3};
        var schema = {maxProperties : 2};
        var result = js.validate( data, schema );
        expect( result.valid ).not.toBe( true );
    } );
} );
