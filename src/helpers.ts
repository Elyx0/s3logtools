'use strict';

// maps string levels to numeric levels
const logLevels = {
    silent: 0,
    error: 1,
    minimal: 2,
    warn: 3,
    info: 4,
    verbose: 5,
    silly: 6
};

const defaults = (initialObj,...potentialFillers) => {
    potentialFillers.forEach(filler => {
        Object.keys(filler).forEach(obj => {
            if (!(obj in initialObj)) {
                initialObj[obj] = filler[obj];
            }
        });
    });
    return initialObj;
};

const print = (options={}, message, loglevel, method = 'log') => {
    // not silent
    // not at a loglevel under minimum specified
    if (!options.json && options.loglevel !== 'silent' && (loglevel == null || logLevels[options.loglevel] >= logLevels[loglevel])) {
        console[method](message);
    }
};

const programError = (options, message) => {
    if (options.cli) {
        print(options, message, null, 'error');
        process.exit(1);
    } else {
        throw new Error(message);
    }
};

const printJson = (options, object) => {
    if (options.loglevel !== 'silent') {
        console.log(JSON.stringify(object, null, 2));
    }
};

module.exports = {
    defaults,
    printJson,
    print,
    programError
};
