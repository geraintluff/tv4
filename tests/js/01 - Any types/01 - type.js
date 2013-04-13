describe( 'JsonSchema supports all of the core JS types and', function () {

    it( 'can validate an empty schema', function () {
        var data = {};
        var schema = {};
        var result = new JsonSchema().validate( data, schema );
        expect( result.valid ).toBe( true );
    } );

    it( 'schema can verify the instance is an object', function () {
        var data = {};
        var schema = {"type" : "object"};
        var result = new JsonSchema().validate( data, schema );
        expect( result.valid ).toBe( true );
    } );

    it( 'schema can specify multiple types per property', function () {
        var schema = {"type": ["object", "string"]};
        var js = new JsonSchema();
        var result = js.validate( {}, schema );
        expect( result.valid ).toBe( true );

        result = js.validate( [], schema );
        expect( result.valid ).not.toBe( true );
    } );

    it( 'schema can specify multiple types per property', function () {
        var data = {};
        var schema = {"type": ["object", "string"]};
        var result = new JsonSchema().validate( data, schema );
        expect( result.valid ).toBe( true );
    } );

    it( 'schema can verify types with arrays', function () {
        var data = [];
        var schema = {"type": ["object", "string"]};
        var result = new JsonSchema().validate( data, schema );
        expect( result.valid ).not.toBe( true );
    } );

    it( 'schema can verify type is an array', function () {
        var data = {};
        var schema = {"type": ["array"]};
        var result = new JsonSchema().validate( data, schema );
        expect( result.valid ).not.toBe( true );
    } );

    it( 'schema can verify type is a string', function () {
        var schema = {"type": ["string"]};
        var js = new JsonSchema();
        var result = js.validate( 5, schema );
        expect( result.valid ).not.toBe( true );

        result = js.validate( '5', schema );
        expect( result.valid ).toBe( true );
    } );

    it( 'schema can verify null instance data is not an object', function () {
        var schema = {"type": ["object"]};
        var js = new JsonSchema();
        var result = js.validate( null, schema );
        expect( result.valid ).not.toBe( true );
    } );

    it( 'schema can verify null instance data correctly', function () {
        var schema = {"type": "null"};
        var js = new JsonSchema();
        var result = js.validate( null, schema );
        expect( result.valid ).toBe( true );
    } );
} );

