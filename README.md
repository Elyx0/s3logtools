[![NPM version](https://badge.fury.io/js/tails3.svg)](http://badge.fury.io/js/tails3) [![GitHub license](https://img.shields.io/badge/license-ISC-blue.svg)](https://github.com/facebook/react/blob/master/LICENSE)  [![CircleCI Status](https://circleci.com/gh/facebook/react.svg?style=shield&circle-token=:circle-token)](https://circleci.com/gh/facebook/react) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://reactjs.org/docs/how-to-contribute.html#your-first-pull-request) [![Known Vulnerabilities](https://snyk.io/test/npm/snyk/badge.svg)](https://snyk.io/synk/github/synk/synk)


### s3logtools: S3 Logs utility module

This script allows handling of S3 logs as incoming streams to be either
piped and colored on the fly from the console, or to consolidate them into a file

It resorts to long polling to update the log as AWS doesn't ship
in real time.

It's designed to work with logs produced by
[s3-streamlogger](http://github.com/coggle/s3-streamlogger) and winston.

### Prerequisites
You need to have an AWS S3 bucket and 
it's recommended to set a new [AWS IAM](https://console.aws.amazon.com/iam/) user with these permissions:
then store his access keys in your `~/.aws/credentials`.
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": "s3:ListBucket",
            "Resource": "*"
        },
        {
            "Sid": "VisualEditor1",
            "Effect": "Allow",
            "Action": "s3:*Object",
            "Resource": "*"
        }
    ]
}
```



### Installation and Usage
```sh
npm install -g s3logtools
```

Ensure that the AWS credentials to access your bucket are [set in your
environment](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-credentials-node.html) 
(for example by setting the `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`
environment variables) or in the `~/.aws/credentials`.

```sh
s3logtools --bucket=your-log-bucket-name --watch
```

More complex operations are possible:
```sh
s3logtools --bucket=your-log-bucket-name --ago='30 days' --output='myfile.csv' --delimiter='|'
```

Full list:

| Options        | Use          
| ------------- |-------------|
| -v     | prints the version number |
| -o, --output <path/filename> | compacts the response into a correctly formatted file (.json/.csv)
| -w, --watch | 'Live tails using polling'
|-s, --start <time> | starts the logging output from this time (momentjs compatible)')
|-e, --end <time> | ends the logging output after this time (momentjs compatible)')
|-a, --ago | starts the logging output <x> time ago (momentjs compatible)')
|--prefix | fetch only logs with the specified prefix')
|-b, --beautify | beautify the output')
|-r, --raw | outputs the logs as is from s3')
|-p, --profile <awsprofilename> | AWS profile name to use from ~/.aws/credentials')
|-f, --filter <pattern> | filters only the logs matching the specified pattern')
|-l, --loglevel <n>| what level of logs to report: silent, error, minimal, warn, info, verbose, silly (default: warn) 


### License
[ISC](http://opensource.org/licenses/ISC): equivalent to 2-clause BSD.

