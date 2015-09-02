///<reference path="tv4.d.ts" />

var str:string;
var strArr:string[];
var bool:boolean;
var num:number;
var obj:any;
var tv4:TV4;
var err:TV4Error;
var errs:TV4Error[];
var single:TV4SingleResult;
var multi:TV4MultiResult;

single = tv4.validateResult(obj, obj);
bool = single.valid;
strArr = single.missing;
err = single.error;

num = err.code;
str = err.message;
str = err.dataPath;
str = err.schemaPath;

multi = tv4.validateMultiple(obj, obj);
bool = multi.valid;
strArr = multi.missing;
errs = multi.errors;

tv4.addSchema(str, obj);
obj = tv4.getSchema(str);
str = tv4.resolveUrl(str, str);

tv4 = tv4.freshApi();
tv4.dropSchemas();
tv4.reset();

strArr = tv4.getMissingUris(/abc/);
strArr = tv4.getSchemaUris(/abc/);
obj = tv4.getSchemaMap()[str];
num = tv4.errorCodes['bla'];

num = tv4.errorCodes['MY_NAME'];


// Here are all the examples from the v1.2.3 documentation at https://www.npmjs.com/package/tv4
var data = '';
var schema : JsonSchema = {type: "string"}
var valid = tv4.validate(data, schema);
var url = 'http://example.com/schema';
tv4.addSchema(url, schema);
var singleErrorResult = tv4.validateResult(data, schema);
var multiErrorResult = tv4.validateMultiple(data, schema);
// async
tv4.validate(data, schema, function (isValid, validationError) {});

// checkRecursive
var a : JsonSchema = {};
var b = { a: a };
a.b = b;
var aSchema = { properties: { b: { $ref: 'bSchema' }}};
var bSchema = { properties: { a: { $ref: 'aSchema' }}};
tv4.addSchema('aSchema', aSchema);
tv4.addSchema('bSchema', bSchema);
tv4.validate(a, aSchema, true);
tv4.validateResult(data, aSchema, true);
tv4.validateMultiple(data, aSchema, true);


// banUnknownProperties
var checkRecursive = true;
tv4.validate(data, schema, checkRecursive, true);
tv4.validateResult(data, schema, checkRecursive, true);
tv4.validateMultiple(data, schema, checkRecursive, true);

// API
tv4.addSchema('http://example.com/schema', {});
tv4.addSchema({});
var schema = tv4.getSchema('http://example.com/schema');
var map = tv4.getSchemaMap();
var schema = map[uri];
var arr = tv4.getSchemaUris();
// optional filter using a RegExp
arr = tv4.getSchemaUris(/^https?:\/\/example.com/);
var arr = tv4.getMissingUris();
// optional filter using a RegExp
var arr = tv4.getMissingUris(/^https?:\/\/example.com/);
tv4.dropSchemas();
var otherTV4 = tv4.freshApi();
tv4.reset();
tv4.setErrorReporter(function (error, data, schema) {
    return "Error code: " + error.code;
});
tv4.language('en-gb');
tv4.addLanguage('fr', {});
tv4.language('fr')
tv4.addFormat('decimal-digits', function (data, schema) {
    if (typeof data === 'string' && !/^[0-9]+$/.test(data)) {
        return null;
    }
    return "must be string of decimal digits";
});
tv4.addFormat({
    'my-format': function (data: any, schema: any): string {return null;},
    'other-format': function (data: any, schema: any): string {return 'oops';}
});
function simpleFailure() {return true;}
function detailedFailure() {return true;}
tv4.defineKeyword('my-custom-keyword', function (data, value, schema) {
    if (simpleFailure()) {
        return "Failure";
    } else if (detailedFailure()) {
        return {code: tv4.errorCodes['MY_CUSTOM_CODE'], message: {param1: 'a', param2: 'b'}};
    } else {
        return null;
    }
});


// Demos
schema = {
    "items": {
        "type": "boolean"
    }
};
{
let data1 = [true, false];
let data2 = [true, 123];
alert("data 1: " + tv4.validate(data1, schema)); // true
alert("data 2: " + tv4.validate(data2, schema)); // false
alert("data 2 error: " + JSON.stringify(tv4.error, null, 4));

schema = {
    "type": "array",
    "items": {"$ref": "#"}
};
}
{
let data1 : any = [[], [[]]];
let data2 : any = [[], [true, []]];
alert("data 1: " + tv4.validate(data1, schema)); // true
alert("data 2: " + tv4.validate(data2, schema)); // false
}

{
    schema = {
        "type": "array",
        "items": {"$ref": "http://example.com/schema" }
    };
    let data = [1, 2, 3];
    alert("Valid: " + tv4.validate(data, schema)); // true
    alert("Missing schemas: " + JSON.stringify(tv4.missing));
}
{
    tv4.addSchema("http://example.com/schema", {
        "definitions": {
            "arrayItem": {"type": "boolean"}
        }
    });
    let schema = {
        "type": "array",
        "items": {"$ref": "http://example.com/schema#/definitions/arrayItem" }
    };
    let data1 = [true, false, true];
    let data2 = [1, 2, 3];
    alert("data 1: " + tv4.validate(data1, schema)); // true
    alert("data 2: " + tv4.validate(data2, schema)); // false
}

// undocumented functions
var uri = '';
obj = tv4.normSchema(schema, uri);



