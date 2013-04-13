describe( 'JsonSchema will validate an instance against multiple schemas and', function () {
    var js;
    beforeEach( function () {
        js = new JsonSchema();
    } );

    it( 'will accept an instance if one (and only one) schema matches', function () {
        var data = 5;
        var schema = {
            "oneOf" : [
                {"type" : "integer"},
                {"type" : "string"},
                {"type" : "string", minLength : 1}
            ]
        };
        var result = js.validate( data, schema );
        expect( result.valid ).toBe( true );
    } );

    it( 'will reject an instance if more than one schema matches', function () {
        var data = "string";
        var schema = {
            "oneOf" : [
                {"type" : "integer"},
                {"type" : "string"},
                {"minLength" : 1}
            ]
        };
        var result = js.validate( data, schema );
        expect( result.valid ).not.toBe( true );
    } );

    it( 'will reject an instance if no schema (in a oneOf) matches', function () {
        var data = false;
        var schema = {
            "oneOf" : [
                {"type" : "integer"},
                {"type" : "string"},
                {"type" : "string", "minLength" : 1}
            ]
        };
        var result = js.validate( data, schema );
        expect( result.valid ).not.toBe( true );
    } );
} );
