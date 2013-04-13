describe( 'JsonScema can use additionalProperties schema to apply schemas to dynamic properties and', function () {
    var js;
    beforeEach( function () {
        js = new JsonSchema();
    } );

    it( 'will use additionalProperties to apply schemas to any props not covered by other property identifiers', function () {
        var data = {intKey : 1, intKey2 : 5, stringKey : "string"};
        var schema = {
            properties : {
                intKey : {"type" : "integer"}
            },
            patternProperties : {
                "^int" : {minimum : 0}
            },
            additionalProperties : {"type" : "string"}
        };
        var result = js.validate( data, schema );
        expect( result.valid ).toBe( true );
    } );

    it( 'will reject additionalProperties that do not match the applied schema', function () {
        var data = {intKey : 10, intKey2 : 5, stringKey : null};
        var schema = {
            properties : {
                intKey : {minimum : 5}
            },
            patternProperties : {
                "^int" : {"type" : "integer"}
            },
            additionalProperties : {"type" : "string"}
        };
        var result = js.validate( data, schema );
        expect( result.valid ).not.toBe( true );
    } );

    it( 'will accept additionalProperties of any schema when boolean true is used', function () {
        var data = {intKey : 10, intKey2 : 5, stringKey : null};
        var schema = {
            properties : {
                intKey : {minimum : 5}
            },
            patternProperties : {
                "^int" : {"type" : "integer"}
            },
            additionalProperties : true
        };
        var result = js.validate( data, schema );
        expect( result.valid ).toBe( true );
    } );

    it( 'will reject any additionalProperties when boolean false is used', function () {
        var data = {intKey : 10, intKey2 : 5, stringKey : null};
        var schema = {
            properties : {
                intKey : {minimum : 5}
            },
            patternProperties : {
                "^int" : {"type" : "integer"}
            },
            additionalProperties : false
        };
        var result = js.validate( data, schema );
        expect( result.valid ).not.toBe( true );
    } );
} );
