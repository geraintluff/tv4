describe( 'JsonSchema will validate that the items in an array are properly typed and', function () {
    var js;
    beforeEach( function () {
        js = new JsonSchema();
    } );

    it( 'will accept an array of integers as long as only integers are in instance', function () {
        var schema = {
            "type": "array",
            "items": {
                "type": "integer"
            }
        };
        var result = js.validate( [1, 2, 3, 4], schema );
        expect( result.valid ).toBe( true );
    } );

    it( 'will reject an array of integers if non-integers are in instance', function () {
        var schema = {
            "type": "array",
            "items": {
                "type": "integer"
            }
        };
        var result = js.validate( [1, 2, true, 4], schema );
        expect( result.valid ).not.toBe( true );
    } );
} );
