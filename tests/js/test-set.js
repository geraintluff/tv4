(function () {
	function CallbackList() {
		this.callbackArguments = null;
		this.callbacks = [];
	}
	CallbackList.prototype = {
		add: function (callback) {
			if (this.callbackArguments != null) {
				callback.apply(null, this.callbackArguments);
			} else {
				this.callbacks[this.callbacks.length] = callback;
			}
		},
		call: function () {
			var i;
			if (this.callbackArguments != null) {
				throw new Error("CallbackList cannot be called more than once");
			}
			this.callbackArguments = arguments;
			for (i = 0; i < this.callbacks.length; i++) {
				this.callbacks[i].apply(null, arguments);
			}
		}
	}

	function Test(name, testFunction) {
		this.name = name;
		this.durationMillis = null;
		this.complete = false;
		this.passed = null;

		var startMillis = 0;
		var runCallbacks = new CallbackList();
		var passCallbacks = new CallbackList();
		var failCallbacks = new CallbackList();
		var completeCallbacks = new CallbackList();

		this.onRun = function (callback) {
			runCallbacks.add(callback);
			return this;
		};
		this.run = function () {
			runCallbacks.call();
			startMillis = (new Date).getTime();
			try {
				result = testFunction.call(this);
				if (result === true) {
					this.pass();
				} else if (result === false || typeof result == "string") {
					this.fail(result);
				}
			} catch (e) {
				try {
					window.console.log("\"" + this.name + "\": " + e);
					window.console.log(e.stack);
					e = e + "\n" + e.stack;
				} catch (e2) {
					// Meh
				}
				this.fail("Exception: " + e);
			}
			return this;
		};

		this.onPass = function (passFunction) {
			passCallbacks.add(passFunction);
			return this;
		};
		this.pass = function () {
			if (this.complete) {
				return;
			}
			this.durationMillis = (new Date).getTime() - startMillis;
			this.passed = true;
			this.complete = true;
			passCallbacks.call();
			completeCallbacks.call();
		}

		this.onFail = function (failFunction) {
			failCallbacks.add(failFunction);
			return this;
		};
		this.fail = function (reason) {
			if (this.complete) {
				return;
			}
			if (reason == undefined) {
				reason = "(no reason given)";
			}
			this.durationMillis = (new Date).getTime() - startMillis;
			this.passed = false;
			this.complete = true;
			failCallbacks.call(reason);
			completeCallbacks.call();
		};

		this.onComplete = function (completeFunction) {
			completeCallbacks.add(completeFunction);
			return this;
		};

		this.assert = function (assertion, message) {
			if (!assertion) {
				this.fail(message);
			}
		}
	}

	function TestSet() {
		this.tests = [];
	}
	TestSet.prototype = {
		add: function (name, testFunction) {
			this.tests[this.tests.length] = new Test(name, testFunction);
			return this;
		},
		run: function (maxParallel, shuffle) {
			var i, j, tmp;
			var test;
			if (maxParallel == undefined) {
				maxParallel = 5;
			}
			var tests = this.tests.slice(0);
			if (shuffle) {
				for (i = 0; i < tests.length; i++) {
					j = Math.floor(Math.random() * (1 + i));
					if (j != i) {
						tmp = tests[i];
						tests[i] = tests[j];
						tests[j] = tmp;
					}
				}
			}
			var executeTest = function () {
				setTimeout(function () {
					if (tests.length > 0) {
						test = tests.shift();
						test.onComplete(executeTest).run();
					}
				}, 0);
			};
			for (i = 0; i < maxParallel; i++) {
				executeTest();
			}
		}
	};

	function recursiveCompare(a, b) {
		if (Array.isArray(a)) {
			if (!Array.isArray(b) || a.length != b.length) {
				return false;
			}
			for (var i = 0; i < a.length; i++) {
				if (!recursiveCompare(a[i], b[i])) {
					return false;
				}
			}
			return true;
		} else if (typeof a == "object") {
			for (var key in a) {
				if (b[key] === undefined && a[key] !== undefined) {
					return false;
				}
			}
			for (var key in b) {
				if (a[key] === undefined && a[key] !== undefined) {
					return false;
				}
			}
			for (var key in a) {
				if (!recursiveCompare(a[key], b[key])) {
					return false;
				}
			}
			return true;
		}
		return a === b;
	}

	window.TestSet = TestSet;
	window.recursiveCompare = recursiveCompare;
})();
