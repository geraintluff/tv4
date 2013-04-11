tests.add("required success", function () {
	var data = {key1:1,key2:2,key3:3};
	var schema = {required:["key1", "key2"]};
	var result = tv4.validate(data, schema);
	return result.valid;
});

tests.add("required failure", function () {
	var data = {key1:1,key2:2,key3:3};
	var schema = {required:["key1", "notDefined"]};
	var result = tv4.validate(data, schema);
	return !result.valid;
});
