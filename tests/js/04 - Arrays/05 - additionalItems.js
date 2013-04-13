describe( 'JsonSchema will validate an additionalItems schema value and', function () {
    var js;
    beforeEach( function () {
        js = new JsonSchema();
    } );

    it( 'will accept additional array values with the same type as the additionalItems schema', function () {
        var data = [1, true, "one", "uno"];
        var schema = {
            "items": [
                {"type": "integer"},
                {"type": "boolean"}
            ],
            "additionalItems": {"type": "string"}
        };
        var result = js.validate(data, schema);
        expect( result.valid ).toBe( true );
    } );

    it( 'will reject additional array values if not matching the additionalItems schema', function () {
        var data = [1, true, "one", 1];
        var schema = {
            "items": [
                {"type": "integer"},
                {"type": "boolean"}
            ],
            "additionalItems": {"type": "string"}
        };
        var result = js.validate(data, schema);
        expect( result.valid ).not.toBe( true );
    } );

    it( 'will accept additional array values regardless of types if additionalItems schema is boolean true', function () {
        var data = [1, true, "one", "uno"];
        var schema = {
            "items": [
                {"type": "integer"},
                {"type": "boolean"}
            ],
            "additionalItems": {"type": "string"}
        };
        var result = js.validate(data, schema);
        expect( result.valid ).toBe( true );
    } );

    it( 'will reject additional array values regardless of type if additionalItems schema is boolean false', function () {
        var data = [1, true, "one", "uno"];
        var schema = {
            "items": [
                {"type": "integer"},
                {"type": "boolean"}
            ],
            "additionalItems": false
        };
        var result = js.validate(data, schema);
        expect( result.valid ).not.toBe( true );
    } );

    it( 'will accept array values that exactly match the number and types', function () {
        var data = [1, true];
        var schema = {
            "items": [
                {"type": "integer"},
                {"type": "boolean"}
            ],
            "additionalItems": false
        };
        var result = js.validate(data, schema);
        expect( result.valid ).toBe( true );
    } );

} );

