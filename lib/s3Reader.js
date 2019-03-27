'use strict';
var stream = require('stream');
var util = require('util');
var streamLine = require('./streamLine.js');
var EventEmitter = require('events').EventEmitter;
function S3Reader(s3, options) {
    if (!(this instanceof S3Reader)) {
        return new S3Reader(options);
    }
    stream.Writable.call(this, options);
    this.s3 = s3;
    this.options = options;
    this.on('files', this.receiveNewFilesList);
}
var fileMatches = function isFileMatchingFromOptions(options, file) {
    return true;
};
/**
 * @param Object[] files
 */
S3Reader.prototype.receiveNewFilesList = function (files) {
    var _this = this;
    files.forEach(function (file) {
        if (fileMatches(_this.options, file)) {
            // Stream contents
            var s3ObjectStreamByLine = streamLine(_this.s3.getObject({
                Bucket: _this.options.bucket,
                Key: file.Key
            }).createReadStream());
            s3ObjectStreamByLine.on('data', function (line) {
                console.log(line.toString('utf-8'));
            });
        }
    });
};
util.inherits(S3Reader, EventEmitter);
module.exports = S3Reader;
