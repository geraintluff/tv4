describe( 'JsonSchema can use regular expressions to define property names and', function () {
    var js;
    beforeEach( function () {
        js = new JsonSchema();
    } );

    it( 'will accept schema assignments using matching patternProperties', function () {
        var data = {intKey: 1, intKey2: 5};
        var schema = {
            properties: {
                intKey: {"type": "integer"}
            },
            patternProperties: {
                "^int": {minimum: 0}
            }
        };
        var result = js.validate(data, schema);
        expect( result.valid ).toBe( true );
    } );

    it( 'will reject validation if schemas assigned using patternProperties are violated', function () {
        var data = {intKey: 1, intKey2: 5};
        var schema = {
            properties: {
                intKey: {"type": "integer"}
            },
            patternProperties: {
                "^int": {minimum: 3}
            }
        };
        var result = js.validate(data, schema);
        expect( result.valid ).not.toBe( true );
    } );

    it( 'will reject validation if schemas assigned using patternProperties are violated', function () {
        var data = {intKey: 10, intKey2: "string value"};
        var schema = {
            properties: {
                intKey: {minimum: 5}
            },
            patternProperties: {
                "^int": {"type": "integer"}
            }
        };
        var result = js.validate(data, schema);
        expect( result.valid ).not.toBe( true );
    } );
} );

