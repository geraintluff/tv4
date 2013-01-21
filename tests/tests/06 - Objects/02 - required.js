tests.add("required success", function () {
	var data = {key1:1,key2:2,key3:3};
	var schema = {required:["key1", "key2"]};
	var valid = validate(data, schema);
	return valid;
});

tests.add("required failure", function () {
	var data = {key1:1,key2:2,key3:3};
	var schema = {required:["key1", "notDefined"]};
	var valid = validate(data, schema);
	return !valid;
});
