// Provides support for asynchronous validation (fetching schemas)
// Callback is optional third argument to tv4.validate() - if not present, synchronous operation
//     callback(result, error);
if (typeof tv4.asyncValidate === 'undefined') {
    tv4.syncValidate = tv4.validate;
    tv4.validate = function (data, schema, callback, checkRecursive, banUnknownProperties) {
        if (typeof callback === 'undefined')
            return this.syncValidate(data, schema, checkRecursive, banUnknownProperties);
        else
            return this.asyncValidate(data, schema, callback, checkRecursive, banUnknownProperties);
    };
    tv4.asyncValidate = function (data, schema, callback, checkRecursive, banUnknownProperties) {
        var result = tv4.validate(data, schema, checkRecursive, banUnknownProperties);
        if (!tv4.missing.length)
            return callback(result, tv4.error);

        // Make a request for each missing schema
        var missingSchemas = function() {
            tv4.missing.map(function (schemaUri) {
                var request = new XMLHttpRequest();
                request.open('GET', schemaUri, true);

                request.onload = function() {
                    if (request.status >= 200 && request.status < 400)
                        tv4.addSchema(schemaUri, JSON.parse(request.responseText));
                    else {
                        // If there's an error, just use an empty schema
                        tv4.addSchema(schemaUri, {});
                    }
                };

                request.onerror = function() {
                    tv4.addSchema(schemaUri, {});
                };

                request.send();
            })
        };
        // When all requests done, try again
        //missingSchemas();
        $.when.apply($, missingSchemas).done(function () {
            var result = tv4.asyncValidate(data, schema, callback, checkRecursive, banUnknownProperties);
        });
    };
}
