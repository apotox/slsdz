export function buildInvokedFunctionArn() {
    return "arn:aws:lambda:us-east-1:123456789012:function:my-lambda-function";
}

export function buildEventBridge() {
    return {
        version: "0",
        id: "df5f6c8e-f7f5-6e0c-653b-a9b90987509f",
        "detail-type": "CloudFormation Stack Status Change",
        source: "arn:aws:cloudformation:us-east-1:123456789012:stack/slsdz-stack-FUNCTION_ID",
        account: "123456789",
        time: "2023-06-07T15:21:30Z",
        region: "us-east-1",
        resources: [
            "arn:aws:cloudformation:us-east-1:123456789012:stack/slsdz-stack-FUNCTION_ID/blablabla",
        ],
        detail: {
            "status-details": {
                status: "CREATE_COMPLETE",
                "status-reason": "",
            },
        },
    };
}

export function buildS3PutObjectEvent() {
    return {
        Records: [
            {
                eventVersion: "2.1",
                eventSource: "aws:s3",
                awsRegion: "us-east-1",
                eventTime: "2023-08-03T12:34:56.789Z",
                eventName: "ObjectCreated:Put",
                userIdentity: {
                    principalId: "EXAMPLE",
                },
                requestParameters: {
                    sourceIPAddress: "192.168.1.1",
                },
                responseElements: {
                    "x-amz-request-id": "EXAMPLE123456789",
                    "x-amz-id-2": "EXAMPLEabcdefg123456789",
                },
                s3: {
                    s3SchemaVersion: "1.0",
                    configurationId: "testConfigRule",
                    bucket: {
                        name: "example-bucket",
                        ownerIdentity: {
                            principalId: "EXAMPLE",
                        },
                        arn: "arn:aws:s3:::example-bucket",
                    },
                    object: {
                        key: "functionId.zip",
                        size: 12345,
                        eTag: "EXAMPLEETAG",
                        versionId: "123456789abcdefg",
                        sequencer: "0A1B2C3D4E5F678901",
                    },
                },
            },
        ],
    };
}
