describe( 'JsonSchema will validate an instance against multiple schemas and', function () {
    var js;
    beforeEach( function () {
        js = new JsonSchema();
    } );

    it( 'will accept the instance if any of the schemas are accepted', function () {
        var data = "hello";
        var schema = {
            "anyOf" : [
                {"type" : "integer"},
                {"type" : "string"},
                {"minLength" : 1}
            ]
        };
        var result = js.validate( data, schema );
        expect( result.valid ).toBe( true );
    } );

    it( 'will reject the instance if all of the schemas are not valid', function () {
        var data = true;
        var schema = {
            "anyOf" : [
                {"type" : "integer"},
                {"type" : "string"}
            ]
        };
        var result = js.validate( data, schema );
        expect( result.valid ).not.toBe( true );
    } );
} );
