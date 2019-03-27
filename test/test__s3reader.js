'use strict';

const S3Reader = require('../lib/s3Reader.js');
const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
// const chaiString = require('chai-string');

chai.use(chaiAsPromised);
// chai.use(chaiString);

describe('s3lt-stream', function () {

    // it('Profile does not exist', () => {
    //     expect(s3stream.init({
    //         bucket: 'musetestlogs',
    //         profile: 'ewdew'
    //     })).to.be.rejected;
    // });

    // it('Bucket omitted', () => {
    //     expect(s3stream.init({
    //         bucket: '',
    //     })).to.be.rejected;
    // });

    // it('Credentials omitted', () => {
    //     expect(s3stream.init({
    //         bucket: 'boop',
    //     })).to.be.rejected;
    // });

    // it('Credentials good head the bucket', () => {
    //     expect(s3stream.init({
    //         bucket: 'musetestlogs',
    //         profile: 's3muzelogs'
    //     })).to.eventually.be.fulfilled;
    // });

    
});
