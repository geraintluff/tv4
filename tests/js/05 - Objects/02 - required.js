describe( 'JsonSchema will validate required properties on an instance and', function () {
    var js;
    beforeEach( function () {
        js = new JsonSchema();
    } );

    it( 'will accept instance if required properties are found', function () {
        var data = {key1 : 1, key2 : 2, key3 : 3};
        var schema = {required : ["key1", "key2"]};
        var result = js.validate( data, schema );
        expect( result.valid ).toBe( true );
    } );

    it( 'will reject instance if required properties are not found', function () {
        var data = {key1 : 1, key2 : 2, key3 : 3};
        var schema = {required : ["key1", "notDefined"]};
        var result = js.validate( data, schema );
        expect( result.valid ).not.toBe( true );
    } );
} );
