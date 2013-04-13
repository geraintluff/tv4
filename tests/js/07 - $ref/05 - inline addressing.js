describe( 'JsonSchema will validate using scema references from within a schema and', function () {
    it( 'will validate against an inline schema fragment', function () {
        var schema = {
            "type": "array",
            "items": {"$ref": "#test"},
            "testSchema": {
                "id": "#test",
                "type": "boolean"
            }
        };
        var data = [true, false];
        var js = new JsonSchema();
        var result = js.validate(data, schema);
        expect( result.valid ).toBe( true );
    } );

    it( 'will reject an instance that does not match the inline schema fragment', function () {
        var schema = {
            "type": "array",
            "items": {"$ref": "#test"},
            "testSchema": {
                "id": "#test",
                "type": "boolean"
            }
        };
        var data = [true, 0];
        var js = new JsonSchema();
        var result = js.validate(data, schema);
        expect( result.valid ).not.toBe( true );
    } );

    it( '', function () {
        var examplePathBase = "http://example.com/" + Math.random();
        var examplePath = examplePathBase +"/schema";
        var schema = {
            "id": examplePath,
            "type": "array",
            "items": {"$ref": "other-schema"},
            "testSchema": {
                "id": "/other-schema",
                "type": "boolean"
            }
        };

        var js = new JsonSchema( examplePath, schema );

        var data = [0, false];
        var result = js.validate(data, examplePath);

        expect( result.missing.length ).toEqual( 1 );
        expect( result.isMissing( examplePathBase + "/other-schema" ) ).toBe( true );
        expect( result.valid ).toBe( true );
    } );
} );
