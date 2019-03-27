'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var AWS = require('aws-sdk'); // TODO: Lock API version?
var S3Reader = require('./s3Reader.js');
// If the maxSockets value is not defined or is Infinity, the SDK assumes a maxSockets value of 50.
// max_concurrent_requests max_queue_size : https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html
var setAWSConfig = function setConfig(_a) {
    var bucket = _a.bucket, profile = _a.profile, accessKeyId = _a.accessKeyId, secretKeyId = _a.secretKeyId, region = _a.region;
    if (!bucket) {
        throw new Error('Expected [bucket] parameter was not found');
    }
    // Setup credentials
    if (profile) {
        // Overrides all
        var credentials = new AWS.SharedIniFileCredentials({ profile: profile });
        AWS.config.credentials = credentials;
        if (!credentials.accessKeyId) {
            throw new Error("profile " + profile + " does not exist, refer to: https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-shared.html");
        }
    }
    else {
        if (!accessKeyId || !secretKeyId || !region) {
            throw new Error('Expected couple [accessKeyId] [secretKeyId] [region] parameter were not found');
        }
        AWS.config = new AWS.Config();
        AWS.config.accessKeyId = accessKeyId;
        AWS.config.secretAccessKey = secretKeyId;
        AWS.config.region = region;
    }
    return new AWS.S3();
};
/**
 * If !options.watch do not repoll
 */
var poll = function polling(s3, s3Reader, options) {
    return __awaiter(this, void 0, void 0, function () {
        var lastEntry, futureOptions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, listObjects(s3, s3Reader, options)];
                case 1:
                    lastEntry = _a.sent();
                    // When the listing is done, queue the next polling
                    // from the last object key
                    if (options.watch) {
                        if (lastEntry && lastEntry.Key) {
                            futureOptions = Object.assign({}, options, { lastEntry: lastEntry });
                            setTimeout(poll.bind(this, s3, s3Reader, futureOptions), options.pollEvery);
                        }
                    }
                    return [2 /*return*/];
            }
        });
    });
};
// Up to 1000, recursive.
// https://docs.aws.amazon.com/AmazonS3/latest/dev/ServerLogs.html
var listObjects = function listFromS3(s3, s3Reader, options) {
    return __awaiter(this, void 0, void 0, function () {
        var Bucket, Prefix, ContinuationToken, lastEntry, s3ListOptions, s3Response, s3Contents, s3ContinuationOptions, moreS3Contents;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    Bucket = options.bucket, Prefix = options.prefix, ContinuationToken = options.ContinuationToken;
                    s3ListOptions = {
                        Bucket: Bucket,
                        Prefix: Prefix
                    };
                    if (options.lastEntry) {
                        s3ListOptions.StartAfter = options.lastEntry.Key;
                    }
                    if (ContinuationToken) {
                        s3ListOptions.ContinuationToken = ContinuationToken;
                    }
                    return [4 /*yield*/, s3.listObjectsV2(s3ListOptions).promise()];
                case 1:
                    s3Response = _a.sent();
                    s3Contents = s3Response.Contents;
                    s3Reader.emit('files', s3Contents);
                    if (!s3Response.isTruncated) return [3 /*break*/, 3];
                    s3ContinuationOptions = Object.assign({}, options, { ContinuationToken: objects.NextContinuationToken });
                    return [4 /*yield*/, listObjects(s3, s3ContinuationOptions)];
                case 2:
                    moreS3Contents = _a.sent();
                    lastEntry = moreS3Contents;
                    return [3 /*break*/, 4];
                case 3:
                    lastEntry = s3Contents[s3Contents.length - 1];
                    _a.label = 4;
                case 4: return [2 /*return*/, lastEntry];
            }
        });
    });
};
var init = function initS3(options) {
    return __awaiter(this, void 0, void 0, function () {
        var s3, e_1, s3Reader;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    s3 = setAWSConfig(options);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, s3.headBucket({ Bucket: options.bucket }).promise()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    throw new Error("Could not read bucket " + options.bucket + ", check the name or S3 permissions for this account.");
                case 4:
                    s3Reader = new S3Reader(s3, options);
                    return [2 /*return*/, poll(s3, s3Reader, options)];
            }
        });
    });
};
module.exports = module.exports = {
    poll: poll,
    init: init,
    listObjects: listObjects,
    setAWSConfig: setAWSConfig,
};
