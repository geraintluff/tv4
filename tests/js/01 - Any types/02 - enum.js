describe( 'JsonSchema will verify enumerations', function () {

    var js;

    beforeEach(function() {
        js = new JsonSchema();
    });

    it( 'can verify an integer', function () {
        var schema = {"enum": [1]};
        var result = js.validate( 1, schema );
        expect( result.valid ).toBe( true );
    } );

    it( 'will reject an integer enum, but a string instance', function () {
        var schema = {"enum": [1]};
        var result = js.validate( "1", schema );
        expect( result.valid ).not.toBe( true );
    } );

    it( 'will accept an empty object enum', function () {
        var result = js.validate( {}, {"enum": [{}]} );
        expect( result.valid ).toBe( true );
    } );

    it( 'will reject an empty object with a populated object enum', function () {
        var result = js.validate( {}, {"enum": [{"key": "value"}]} );
        expect( result.valid ).not.toBe( true );
    } );

    it( 'will accept a mixed array of values in an enum', function () {
        var result = js.validate( [1, true, 0], {"enum": [[1, true, 0], 5, {}]} );
        expect( result.valid ).toBe( true );
    } );

    it( 'will reject an array enum if it has more elements than schema', function () {
        var result = js.validate( [1, true, 0, 5], {"enum": [[1, true, 0], 5, {}]} );
        expect( result.valid ).not.toBe( true );
    } );

    it( 'will reject an array enum if the elements are not in same order', function () {
        var result = js.validate( [1, 0, true], {"enum": [[1, true, 0], 5, {}]} );
        expect( result.valid ).not.toBe( true );
    } );

    it( 'will reject an array if the elements do not have the same value as enum', function () {
        var result = js.validate( [1, true, 5], {"enum": [[1, true, 0], 5, {}]} );
        expect( result.valid ).not.toBe( true );
    } );
} );
