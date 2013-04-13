describe( 'JsonSchema manages schema files and references', function () {

    it( 'will add schemas in the constructor and fetch them back', function () {
        var url = "http://example.com/schema" + Math.random();
        var schema = {
            "test" : "value"
        };
        var js = new JsonSchema( url, schema );
        var xSchema = js.getSchema( url );
        expect( xSchema ).toBeDefined();
        expect( js.getSchema( url ) ).toBe( schema );
    } );

    xit( 'will use the schema\'s id as a uri if not specified directly', function () {
        var url = "http://example.com/schema" + Math.random();
        var schema = {
            "id": url,
            "test" : "value"
        };
        var js = new JsonSchema( schema );
        var xSchema = js.getSchema( url );
        expect( xSchema ).toBeDefined();
        expect( js.getSchema( url ) ).toBe( schema );
    } );

    it( 'will handle schema uris with blank fragments', function () {
        var url = "http://example.com/schema" + Math.random();
        var schema = {
            "test": "value"
        };
        var js = new JsonSchema( url, schema );
        var xSchema = js.getSchema( url + '#');
        expect( xSchema ).toBeDefined();
        expect( xSchema.test ).toBe( 'value' );
    } );

    it( 'will handle schema uris with json pointers', function () {
        var url = "http://example.com/schema" + Math.random();
        var schema = {
            "items": {
                "properties": {
                    "key[]": {
                        "inner/key~": "value"
                    }
                }
            }
        };
        var js = new JsonSchema( url, schema );
        var xSchema = js.getSchema( url + '#/items/properties/key%5B%5D/inner~1key~0');
        expect( xSchema ).toBe( 'value' );
    } );
} );
