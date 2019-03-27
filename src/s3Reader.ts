'use strict';

const stream = require('stream');
const util = require('util');
const streamLine = require('./streamLine.js');
const EventEmitter = require('events').EventEmitter;

function S3Reader(s3, options) {
    if (!(this instanceof S3Reader)) {
        return new S3Reader(options);
    }
    stream.Writable.call(this, options);
    this.s3 = s3;
    this.options = options;
    this.on('files', this.receiveNewFilesList);
}

const fileMatches = function isFileMatchingFromOptions(options, file) {
    return true;
}

/**
 * @param Object[] files 
 */
S3Reader.prototype.receiveNewFilesList = function (files) {
    files.forEach(file => {
        if (fileMatches(this.options,file)) {
            // Stream contents
            const s3ObjectStreamByLine = streamLine(this.s3.getObject({
                Bucket: this.options.bucket,
                Key: file.Key
            }).createReadStream());

            s3ObjectStreamByLine.on('data', line => {
                console.log(line.toString('utf-8'));
            });
        }
    });
};

util.inherits(S3Reader, EventEmitter);

module.exports = S3Reader;