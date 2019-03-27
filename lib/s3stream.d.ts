declare const _default: {
    poll: (s3: any, s3Reader: any, options: any) => Promise<void>;
    init: (options: any) => Promise<void>;
    listObjects: (s3: any, s3Reader: any, options: any) => Promise<any>;
    setAWSConfig: ({ bucket, profile, accessKeyId, secretKeyId, region }: {
        bucket: any;
        profile: any;
        accessKeyId: any;
        secretKeyId: any;
        region: any;
    }) => any;
};
export = _default;
