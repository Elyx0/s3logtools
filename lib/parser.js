'use strict';
var s3RegexString = '([^ ]*) ([^ ]*) \\[(.*?)\\] ([^ ]*) ([^ ]*) ([^ ]*) ([^ ]*) ([^ ]*) \\"([^ ]*)\\s*([^ ]*)\\s*([^ ]*)" (- |[^ ]*) ([^ ]*) ([^ ]*) ([^ ]*) ([^ ]*) ([^ ]*) ([^ ]*) ("[^"]*") ([^ ]*).*$';
var s3Regex = new RegExp(s3RegexString);
var mapper = {};
var parse = function (input) {
    return mapper[input.exec(s3Regex)];
};
module.exports = parse;
