// global config
'use strict';

const AWS = require('aws-sdk');
const s3stream = require('../lib/s3stream.js');
const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(chaiAsPromised);
chai.use(sinonChai);


describe('s3lt-stream', function () {

    describe('listObjects', function () {
        let sandbox;
        beforeEach(function () {
            sandbox = sinon.createSandbox();
        });
        afterEach(function () {
            sandbox.restore();
        });

        it('returns lastEntry', async function () {
            // No continuation token
            const options = {bucket: 'hi', prefix: 'prefix'};
            const lastEntry = await s3stream.listObjects(s3,s3Reader, options);
        });
    });

    describe('setAWSConfig', function () {
        let sandbox;
        beforeEach(function () {
            sandbox = sinon.createSandbox();
        });
        afterEach(function () {
            sandbox.restore();
        });

        it('fails if no params', () => {
            expect(s3stream.setAWSConfig).to.throw(/bucket/);
        });

        it('fails if missing params', () => {
            sandbox.stub(AWS,'Config').returns({});
            sandbox.stub(AWS,'S3').returns({});
            sandbox.stub(AWS,'SharedIniFileCredentials').returns({accessKeyId: true,secretAccessKey: true,region: true});
            expect(s3stream.setAWSConfig.bind(null,{bucket: 1})).to.throw(/couple/);
        });

        it('suceeds if profile', () => {
            const conf = {accessKeyId: true,secretAccessKey: true,region: true};
            sandbox.stub(AWS,'Config').returns(conf);
            sandbox.stub(AWS,'SharedIniFileCredentials').returns(conf);
            sandbox.stub(AWS,'S3').returns(conf);
            s3stream.setAWSConfig({bucket: 'any',profile: 'me'});
            expect(AWS.S3).to.have.been.called;
        });


        it('fails if profile does not exist keys', () => {
            const conf = {secretAccessKey: true,region: true};
            sandbox.stub(AWS,'Config').returns(conf);
            sandbox.stub(AWS,'SharedIniFileCredentials').returns(conf);
            sandbox.stub(AWS,'S3').returns(conf);
            expect(s3stream.setAWSConfig.bind(null,{bucket: 'any',profile: 'me'})).to.throw(/profile/);
        });

    });


});
