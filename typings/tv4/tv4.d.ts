// Type definitions for Tiny Validator tv4 1.0.6
// Project: https://github.com/geraintluff/tv4
// Definitions by: Bart van der Schoor <https://github.com/Bartvds>
// Definitions by: Peter Snider <https://github.com/psnider>
// Definitions: https://github.com/borisyankov/DefinitelyTyped


// Note that every top-level property is optional in json-schema
declare type JsonSchema = any;
/*
interface JsonSchema {
	title?: string;      	// used for humans only, and not used for computation
    description?: string;	// used for humans only, and not used for computation
    id?: string;
    $schema?: string;
    type?: string;
	items?: any[];
    properties?: any;
    patternProperties?: any; 
    additionalProperties?: boolean;
    required?: string[];
	definitions?: any;
	default?: any;
}
*/

declare type TV4SchemaMap = {[uri: string]: JsonSchema;};
// maps error codes/names to human readable error description for a single language
declare type TV4ErrorMap  = {[errorCode: string]: string;};


interface TV4ErrorCodes {
	[key:string]:number;
}
interface TV4Error {
	code:number;
	message:any;
	dataPath?:string;
	schemaPath?:string;
	subErrors?: TV4Error[];
}
interface TV4ErrorVar extends TV4Error {
	params: any;
	subErrors: any;
	stack: string;
}
interface TV4BaseResult {
	missing:string[];
	valid:boolean;
}
interface TV4SingleResult extends TV4BaseResult {
	error:TV4Error;
}
interface TV4MultiResult extends TV4BaseResult {
	errors:TV4Error[];
}
// documentation doesnt agree with code in tv4, this type agrees with code
declare type FormatValidationFunction = (data: any, schema: JsonSchema) => string;
// documentation doesnt agree with code in tv4, this type agrees with code
declare type KeywordValidationFunction = (data: any, value: any, schema: JsonSchema, dataPointerPath: string) => string | TV4Error;
// documentation doesnt agree with code in tv4, this type agrees with code
declare type AsyncValidationCallback = (isValid: boolean, error: TV4Error) => void;
interface TV4 {
	error: TV4ErrorVar;
	missing: string[];
	// primary API
	validate(data: any, schema: JsonSchema, checkRecursive?: boolean): boolean;
	validate(data: any, schema: JsonSchema, checkRecursive: boolean, banUnknownProperties: boolean): boolean;
	validateResult(data: any, schema: JsonSchema, checkRecursive?: boolean): TV4SingleResult;
	validateResult(data: any, schema: JsonSchema, checkRecursive: boolean, banUnknownProperties: boolean): TV4SingleResult;
	validateMultiple(data: any, schema: JsonSchema, checkRecursive?: boolean): TV4MultiResult;
	validateMultiple(data: any, schema: JsonSchema, checkRecursive: boolean, banUnknownProperties: boolean): TV4MultiResult;
	// from including: tv4.async-jquery.js
	validate(data: any, schema: JsonSchema, callback: AsyncValidationCallback, checkRecursive?: boolean): void;
	validate(data: any, schema: JsonSchema, callback: AsyncValidationCallback, checkRecursive: boolean, banUnknownProperties: boolean): void;

	// additional API for more complex cases
    addSchema(schema: JsonSchema): void;
	addSchema(uri:string, schema: JsonSchema): void;
	getSchema(uri:string): JsonSchema;
	getSchemaMap(): TV4SchemaMap;
	getSchemaUris(filter?: RegExp): string[];
	getMissingUris(filter?: RegExp): string[];
	dropSchemas(): void;
	freshApi(): TV4;
	reset(): void;
	setErrorReporter(lang: string): void;
	setErrorReporter(reporter: (error: TV4Error, data: any, schema: JsonSchema) => string): void;
	language(code: string): void;
	addLanguage(code: string, map: TV4ErrorMap): void;
	addFormat(format: string, validationFunction: FormatValidationFunction): void;
	addFormat(formats: {[formatName: string]: FormatValidationFunction;}): void;
    defineKeyword(keyword: string, validationFunction: KeywordValidationFunction): void;
	defineError(codeName: string, codeNumber: number, defaultMessage: string): void;

	// not documented
	normSchema(schema: JsonSchema, baseUri:string):any;
	resolveUrl(base:string, href:string):string;


	errorCodes:TV4ErrorCodes;
}
declare module "tv4" {
	var tv4: TV4
	export = tv4;
}
