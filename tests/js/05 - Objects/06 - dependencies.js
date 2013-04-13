describe( 'JsonScema', function () {
    var js;
    beforeEach( function () {
        js = new JsonSchema();
    } );

    it( 'will validate the presence of a property if another property is present by name', function () {
        var data = {key1 : 5, key2 : "string"};
        var schema = {
            dependencies : {
                key1 : "key2"
            }
        };
        var result = js.validate( data, schema );
        expect( result.valid ).toBe( true );
    } );

    it( 'will reject the instance if a dependent property is not located by name', function () {
        var data = {key1 : 5};
        var schema = {
            dependencies : {
                key1 : "key2"
            }
        };
        var result = js.validate( data, schema );
        expect( result.valid ).not.toBe( true );
    } );

    it( 'will accept the instance if the dependent property is specified using array notation and by name', function () {
        var data = {key1 : 5, key2 : "string"};
        var schema = {
            dependencies : {
                key1 : ["key2"]
            }
        };
        var result = js.validate( data, schema );
        expect( result.valid ).toBe( true );
    } );

    it( 'will reject the instance if the dependent property is specified using array notation, but not found by name', function () {
        var data = {key1 : 5};
        var schema = {
            dependencies : {
                key1 : ["key2"]
            }
        };
        var result = js.validate( data, schema );
        expect( result.valid ).not.toBe( true );
    } );

    it( 'will accept the instance if all of the dependent properties are present by name', function () {
        var data = {key1 : 5, key2 : "string", key3: true};
        var schema = {
            dependencies : {
                key1 : ["key2", "key3"]
            }
        };
        var result = js.validate( data, schema );
        expect( result.valid ).toBe( true );
    } );

    it( 'will reject the instance if one of the dependent properties is not present by name', function () {
        var data = {key1 : 5, key2 : "string", key4: true};
        var schema = {
            dependencies : {
                key1 : ["key2", "key3"]
            }
        };
        var result = js.validate( data, schema );
        expect( result.valid ).not.toBe( true );
    } );

    it( 'will accept the instance if the dependent property is specified by schema', function () {
        var data = {key1 : 5, key2 : "string"};
        var schema = {
            dependencies : {
                key1 : {
                    properties : {
                        key2 : {"type" : "string"}
                    }
                }
            }
        };
        var result = js.validate( data, schema );
        expect( result.valid ).toBe( true );
    } );

    it( 'will reject the instance if the dependent property is specified by schema, but schema does not apply', function () {
        var data = {key1 : 5, key2 : 5};
        var schema = {
            dependencies : {
                key1 : {
                    properties : {
                        key2 : {"type" : "string"}
                    }
                }
            }
        };
        var result = js.validate( data, schema );
        expect( result.valid ).not.toBe( true );
    } );

    it( 'will accept the instance if multiple dependent properties are specified by schema', function () {
        var data = {key1 : 5, key2 : "string", key: true};
        var schema = {
            dependencies : {
                key1 : {
                    properties : {
                        key2 : {"type" : "string"},
                        key3 : {"type" : "boolean"}
                    }
                }
            }
        };
        var result = js.validate( data, schema );
        expect( result.valid ).toBe( true );
    } );

    it( 'will reject the instance if one of the multiple dependent properties do not follow the schema', function () {
        var data = {key1 : 5, key2 : "string", key: 5};
        var schema = {
            dependencies : {
                key1 : {
                    properties : {
                        key2 : {"type" : "string"},
                        key3 : {"type" : "boolean"}
                    }
                }
            }
        };
        var result = js.validate( data, schema );
        expect( result.valid ).toBe( true );
    } );
} );

