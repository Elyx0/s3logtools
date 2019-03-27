'use strict';

var assert = require('assert');
var fs = require('fs');
var streamLine = require('../lib/streamLine.js');
var request = require('request');

var regEx = /\r\n|[\n\v\f\r\x85\u2028\u2029]/g;

describe('streamLine', function () {

    it('should pipe a small file', function (done) {
        console.log(process.cwd());
        var input = fs.createReadStream('./test/txts/CRLF.txt');
        var lineStream = streamLine(input);
        var output = fs.createWriteStream('./test/txts/test.txt');
        lineStream.pipe(output);
        output.on('close', function () {
            var out = fs.readFileSync('./test/txts/test.txt', 'utf8');
            var in_ = fs.readFileSync('./test/txts/CRLF.txt', 'utf8').replace(/\n/g, '');
            assert.equal(in_, out);
            fs.unlinkSync('./test/txts/test.txt');
            done();
        });
    });

    it('should work with streams2 API', function (done) {
        var stream = fs.createReadStream('./test/txts/CRLF.txt');
        stream = streamLine.createStream(stream);

        stream.on('readable', function () {
            var line;
            while ((line = stream.read()) !== null) {} // eslint-ignore-line
        });

        stream.on('end', function () {
            done();
        });
    });

    it('should ignore empty lines by default', function (done) {
        var input = fs.createReadStream('./test/txts/empty.txt');
        var lineStream = streamLine(input);
        lineStream.setEncoding('utf8');

        var lines1 = [];
        lineStream.on('data', function (line) {
            lines1.push(line);
        });

        lineStream.on('end', function () {
            var lines2 = fs.readFileSync('./test/txts/empty.txt', 'utf8').split(regEx);
            lines2 = lines2.filter(function (line) {
                return line.length > 0;
            });
            assert.deepEqual(lines2, lines1);
            done();
        });
    });

    it('should keep empty lines when keepEmptyLines is true', function (done) {
        var input = fs.createReadStream('./test/txts/empty.txt');
        var lineStream = streamLine(input, {keepEmptyLines: true});
        lineStream.setEncoding('utf8');

        var lines = [];
        lineStream.on('data', function (line) {
            lines.push(line);
        });

        lineStream.on('end', function () {
            assert.deepEqual(['', '', '', '', '', 'Line 6'], lines);
            done();
        });
    });

    it('should not split a CRLF which spans two chunks', function (done) {
        var input = fs.createReadStream('./test/txts/CRLF.txt');
        var lineStream = streamLine(input, {keepEmptyLines: true});
        lineStream.setEncoding('utf8');

        var lines = [];
        lineStream.on('data', function (line) {
            lines.push(line);
        });

        lineStream.on('end', function () {
            assert.equal(2, lines.length);
            done();
        });
    });

    it('should read a large file', function (done) {
        readFile('./test/txts/rfc.txt', done);
    });

    it('should read a huge file', function (done) {
    // Readable highWaterMark is 16384, so we test a file with more lines than this
        readFile('./test/txts/rfc_huge.txt', done);
    });

    function readFile(filename, done) {
        var input = fs.createReadStream(filename);
        var lineStream = streamLine(input);
        lineStream.setEncoding('utf8');

        var lines2 = fs.readFileSync(filename, 'utf8').split(regEx);
        lines2 = lines2.filter(function (line) {
            return line.length > 0;
        });

        var lines1 = [];
        var i = 0;
        lineStream.on('data', function (line) {
            lines1.push(line);
            if (line != lines2[i]) {
                console.log('EXPECTED:', lines2[i]);
                console.log('     GOT:', line);
                assert.fail(null, null, 'difference at line ' + (i + 1));
            }
            i++;
        });

        lineStream.on('end', function () {
            assert.equal(lines2.length, lines1.length);
            assert.deepEqual(lines2, lines1);
            done();
        });
    }

    // it('should handle encodings like fs', function (done) {
    //     areStreamsEqualTypes(undefined, function () {
    //         areStreamsEqualTypes({encoding: 'utf8'}, function () {
    //             done();
    //         });
    //     });
    // });

    it('should work with old-style streams', function (done) {
        var stream = streamLine(request.get('http://www.google.com'));
        stream.on('data',function (data) {
        });
        stream.on('end',function () {
            done();
        });
    });

    // it('should pause() and resume() with a huge file', function (done) {
    //     this.timeout(25000);
    //     var input = fs.createReadStream('./test/txts/rfc_huge.txt');
    //     var lineStream = streamLine(input);
    //     lineStream.setEncoding('utf8');

    //     var lines2 = fs.readFileSync('./test/txts/rfc_huge.txt', 'utf8').split(regEx);
    //     lines2 = lines2.filter(function (line) {
    //         return line.length > 0;
    //     });

    //     var lines1 = [];
    //     var i = 0;
    //     lineStream.on('data', function (line) {
    //         lines1.push(line);
    //         if (line != lines2[i]) {
    //             console.log('EXPECTED:', lines2[i]);
    //             console.log('     GOT:', line);
    //             assert.fail(null, null, 'difference at line ' + (i + 1));
    //         }
    //         i++;

    //         // pause/resume
    //         lineStream.pause();
    //         setTimeout(function () {
    //             lineStream.resume();
    //         }, 0);
    //     });

    //     lineStream.on('end', function () {
    //         assert.equal(lines2.length, lines1.length);
    //         assert.deepEqual(lines2, lines1);
    //         done();
    //     });
    // });

    // function areStreamsEqualTypes(options, callback) {
    //     var fsStream = fs.createReadStream('./test/txts/CRLF.txt', options);
    //     var lineStream = streamLine(fs.createReadStream('./test/txts/CRLF.txt', options));
    //     fsStream.on('data', function (data1) {
    //         lineStream.on('data', function (data2) {
    //             assert.equal(Buffer.isBuffer(data1), Buffer.isBuffer(data2));
    //         });
    //         lineStream.on('end', function () {
    //             callback();
    //         });
    //     });
    // }

});
