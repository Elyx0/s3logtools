'use strict';

const AWS = require('aws-sdk'); // TODO: Lock API version?
const S3Reader = require('./s3Reader.js');

// If the maxSockets value is not defined or is Infinity, the SDK assumes a maxSockets value of 50.
// max_concurrent_requests max_queue_size : https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html
const setAWSConfig = function setConfig(
    {
        bucket,
        profile,
        accessKeyId,
        secretKeyId,
        region
    }) {
    if (!bucket) {
        throw new Error('Expected [bucket] parameter was not found');
    }
    // Setup credentials
    if (profile) {
        // Overrides all
        const credentials = new AWS.SharedIniFileCredentials({profile});
        AWS.config.credentials = credentials;
        if (!credentials.accessKeyId) {
            throw new Error(`profile ${profile} does not exist, refer to: https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-shared.html`);
        }
    } else {
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
const poll = async function polling(s3,s3Reader,options) {
    const lastEntry = await listObjects(s3,s3Reader,options);
    // When the listing is done, queue the next polling
    // from the last object key
    if (options.watch) {
        if (lastEntry &&  lastEntry.Key) {
            const futureOptions = Object.assign({},options,{lastEntry});
            setTimeout(poll.bind(this,s3,s3Reader,futureOptions),options.pollEvery);
        }
    }
};

// Up to 1000, recursive.
// https://docs.aws.amazon.com/AmazonS3/latest/dev/ServerLogs.html
const listObjects = async function listFromS3(s3, s3Reader, options) {
    const {bucket: Bucket, prefix: Prefix, ContinuationToken} = options;
    let lastEntry;

    const s3ListOptions = {
        Bucket,
        Prefix
    };
    if (options.lastEntry) {
        s3ListOptions.StartAfter = options.lastEntry.Key;
    }
    if (ContinuationToken) {
        s3ListOptions.ContinuationToken = ContinuationToken;
    }
    const s3Response = await s3.listObjectsV2(s3ListOptions).promise();
    const s3Contents = s3Response.Contents;
    s3Reader.emit('files',s3Contents);
    if (s3Response.isTruncated) {
        const s3ContinuationOptions = Object.assign({}, options, {ContinuationToken: objects.NextContinuationToken});
        const moreS3Contents = await listObjects(s3, s3ContinuationOptions);
        lastEntry = moreS3Contents;
    } else {
        lastEntry = s3Contents[s3Contents.length - 1];
    }
    return lastEntry;
};

const init = async function initS3(options) {
    const s3 = setAWSConfig(options);
    // Check connectivity
    try {
        await s3.headBucket({Bucket: options.bucket}).promise();
    } catch (e) {
        throw new Error(`Could not read bucket ${options.bucket}, check the name or S3 permissions for this account.`);
    }
    // Start the polling of the files in the bucket
    const s3Reader = new S3Reader(s3,options);
    return poll(s3,s3Reader,options);
};


export = module.exports = {
    poll,
    init,
    listObjects,
    setAWSConfig,
};
