'use strict';

const s3RegexString = '([^ ]*) ([^ ]*) \\[(.*?)\\] ([^ ]*) ([^ ]*) ([^ ]*) ([^ ]*) ([^ ]*) \\"([^ ]*)\\s*([^ ]*)\\s*([^ ]*)" (- |[^ ]*) ([^ ]*) ([^ ]*) ([^ ]*) ([^ ]*) ([^ ]*) ([^ ]*) ("[^"]*") ([^ ]*).*$';
const s3Regex = new RegExp(s3RegexString);
const mapper = {

};

const parse = input => {

    return mapper[input.exec(s3Regex)];
};

module.exports = parse;

/*

 bucketowner STRING,
  bucket STRING,
  requestdatetime STRING,
  remoteip STRING,
  requester STRING,
  requestid STRING,
  operation STRING,
  key STRING,
  requesturi_operation STRING,
  requesturi_key STRING,
  requesturi_httpprotoversion STRING,
  httpstatus STRING,
  errorcode STRING,
  bytessent BIGINT,
  objectsize BIGINT,
  totaltime STRING,
  turnaroundtime STRING,
  referrer STRING,
  useragent STRING,
  versionid STRING

  */
