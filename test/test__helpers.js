'use strict';

const helpers = require('../lib/helpers.js');
const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
// const chaiString = require('chai-string');

chai.use(chaiAsPromised);
chai.use(sinonChai);

describe('s3lt-helpers', function () {
    describe('defaults', () => {
        it('fills defaults', () => {
            const actual = helpers.defaults({},{a: 1});
            const expected = {a: 1};
            expect(actual).to.deep.equal(expected);
        });

        it('no override defaults', () => {
            const actual = helpers.defaults({a: 1},{a: 2,b: 3});
            const expected = {a: 1,b: 3};
            expect(actual).to.deep.equal(expected);
        });
    });

    describe('programError', function () {
        it('throws',()=>{
            expect(helpers.programError.bind({},null)).to.throw;
        });

        it('throws',()=>{
            expect(helpers.programError.bind(null,{cli:false})).to.throw;
        });
    });

    describe('print', function () {
        beforeEach(function () {
            sinon.spy(console,'log');
        });
        afterEach(function () {
            console.log.restore();
        });
        it('prints', () => {
            helpers.print({json: false,loglevel: 'verbose'},'test','silent');
            expect(console.log.calledWith('log','test'));
        });
        it('printJson',() => {
            helpers.printJson({a: 1});
            expect(console.log.calledWith(JSON.stringify({a: 1},null,2)));
        });
    });
});
