'use strict';
// maps string levels to numeric levels
var logLevels = {
    silent: 0,
    error: 1,
    minimal: 2,
    warn: 3,
    info: 4,
    verbose: 5,
    silly: 6
};
var defaults = function (initialObj) {
    var potentialFillers = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        potentialFillers[_i - 1] = arguments[_i];
    }
    potentialFillers.forEach(function (filler) {
        Object.keys(filler).forEach(function (obj) {
            if (!(obj in initialObj)) {
                initialObj[obj] = filler[obj];
            }
        });
    });
    return initialObj;
};
var print = function (options, message, loglevel, method) {
    if (options === void 0) { options = {}; }
    if (method === void 0) { method = 'log'; }
    // not silent
    // not at a loglevel under minimum specified
    if (!options.json && options.loglevel !== 'silent' && (loglevel == null || logLevels[options.loglevel] >= logLevels[loglevel])) {
        console[method](message);
    }
};
var programError = function (options, message) {
    if (options.cli) {
        print(options, message, null, 'error');
        process.exit(1);
    }
    else {
        throw new Error(message);
    }
};
var printJson = function (options, object) {
    if (options.loglevel !== 'silent') {
        console.log(JSON.stringify(object, null, 2));
    }
};
module.exports = {
    defaults: defaults,
    printJson: printJson,
    print: print,
    programError: programError
};
