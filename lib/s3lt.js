'use strict';
var chalk = require('chalk');
var _a = require('./helpers.js'), print = _a.print, defaults = _a.defaults;
function initOptions(options) {
    return defaults({}, options, {
        output: false,
        start: '1 day',
        ago: null,
        prefix: null,
        beautify: true,
        raw: false,
        profile: 'default',
        filter: null,
        loglevel: 'verbose',
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || null,
        secretKeyId: process.env.AWS_ACCESS_KEY_ID || null,
    });
}
/**
 * @summary Main entry point
 * @param {Object} options
 */
function run(options) {
    if (options === void 0) { options = {}; }
    // if not executed as command line, set up defaults
    if (!options.cli) {
        options = defaults({}, options, {
            args: []
        });
    }
    console.log(options);
    options = initOptions(options);
    print(options, chalk.green('Initializing...', 'verbose'));
}
module.exports = {
    run: run,
};
