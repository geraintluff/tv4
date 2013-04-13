describe( 'JsonSchema will validate the property name and type of an instance and', function () {
    var js;
    beforeEach( function () {
        js = new JsonSchema();
    } );

    it( 'will accept properties with the correct types', function () {
        var data = {intKey: 1, stringKey: "one"};
        var schema = {
            properties: {
                intKey: {"type": "integer"},
                stringKey: {"type": "string"}
            }
        };
        var result = js.validate(data, schema);
        expect( result.valid ).toBe( true );
    } );

    it( 'will reject properties with incorrect types', function () {
        var data = {intKey: 1, stringKey: true};
        var schema = {
            properties: {
                intKey: {"type": "integer"},
                stringKey: {"type": "string"}
            }
        };
        var result = js.validate(data, schema);
        expect( result.valid ).not.toBe( true );
    } );
} );

