'use strict';

const s3lt = require('../lib/s3lt.js');
'use strict';

const parser = require('../lib/parser.js');
const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
// const chaiString = require('chai-string');

chai.use(chaiAsPromised);




const fs = require('fs');
const spawn = require('spawn-please');
const tmp = require('tmp');

describe('s3lt', function () {
    describe('run', () => {
        expect(true).to.be.true;
    });
});
