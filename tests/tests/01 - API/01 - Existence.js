tests.add("validate() exists", function () {
	this.assert(typeof window.validate == "function", "Does not exist");
	return true;
});