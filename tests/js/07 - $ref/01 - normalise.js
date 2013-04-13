describe( 'JsonSchema can normalize a schema and', function () {
    var js;
    beforeEach( function () {
        js = new JsonSchema();
    } );

    it( 'will ensure immediate reference fragments are untouched', function () {
        var schema = {
            "items" : {"$ref" : "#"}
        };
        js.normSchema( schema );
        expect( schema.items['$ref'] ).toBe( "#" );
    } );

    it( 'will resolve reference fragments relative to base uri', function () {
        var schema = {
            "id" : "baseUrl",
            "items" : {"$ref" : "#"}
        };
        js.normSchema( schema );
        expect( schema.items['$ref'] ).toBe( "baseUrl#" );
    } );

    it( 'will resolve reference fragments relative to base uri', function () {
        var schema = {
            "id" : "http://example.com/schema",
            "items" : {
                "id" : "otherSchema",
                "items" : {
                    "$ref" : "#"
                }
            }
        };
        js.normSchema( schema );
        expect( schema.items.id ).toBe( "http://example.com/otherSchema" );
        expect( schema.items.items['$ref'] ).toBe( "http://example.com/otherSchema#" );
    } );

    it( 'will not mess with enumerations while resolving references', function () {
        var schema = {
            "id" : "http://example.com/schema",
            "items" : {
                "id" : "otherSchema",
                "enum" : [
                    {
                        "$ref" : "#"
                    }
                ]
            }
        };
        js.normSchema( schema );
        expect( schema.items['enum'][0]['$ref'] ).toBe( "#" );
    } );

    it( 'will only resolve references when id and $ref values are strings', function () {
        var schema = {
            "properties" : {
                "id" : {"type" : "integer"},
                "$ref" : {"type" : "integer"}
            }
        };
        var data = {"id" : "test", "$ref" : "test"};
        js.normSchema( schema );
        var result = js.validate( data, schema );
        expect( result.valid ).not.toBe( true );
    } );

} );
