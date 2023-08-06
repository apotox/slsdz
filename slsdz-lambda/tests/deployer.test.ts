import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
    return {
        getFunction: vi.fn(),
        createStack: vi.fn(),
        updateFunctionCode: vi.fn(),
    };
});

vi.mock("aws-sdk/clients/lambda", () => {
    const SomeClass = vi.fn(() => ({
        getFunction: mocks.getFunction,
        updateFunctionCode: mocks.updateFunctionCode,
    }));

    return {
        default: SomeClass,
    };
});
vi.mock("aws-sdk/clients/cloudformation", () => {
    const SomeClass = vi.fn(() => ({
        createStack: mocks.createStack,
    }));

    return {
        default: SomeClass,
    };
});

import { handler } from "../src/deployer";
import { buildS3PutObjectEvent, buildInvokedFunctionArn } from "./fixtures";

describe("test deployer function", () => {
    it("should handle s3 event - new function", async () => {
        mocks.getFunction.mockReturnValue({
            promise: () =>
                Promise.reject({
                    code: "ResourceNotFoundException",
                }),
        });
        mocks.createStack.mockReturnValue({
            promise: () => Promise.resolve({}),
        });

        const e = buildS3PutObjectEvent();
        const result = await handler(e, {
            invokedFunctionArn: buildInvokedFunctionArn(),
        } as any);

        expect(mocks.createStack).toBeCalledWith({
            StackName: expect.stringContaining("sls-stack-functionId-"),
            TemplateBody:
                // eslint-disable-next-line quotes
                '---\nParameters:\n  functionName:\n    Type: "String"\n  basicRoleArn:\n    Type: "String"\n  functionsBucket:\n    Type: "String"\n  fileName:\n    Type: "String"\n  apigatewayId:\n    Type: "String"\n  apigatewayStage:\n    Type: "String"\n  certificateArn:\n    Type: "String"\n  domainName:\n    Type: "String"\nResources:\n  LambdaFunction:\n    Type: \'AWS::Lambda::Function\'\n    Properties:\n      FunctionName: !Ref functionName\n      Runtime: nodejs16.x\n      Role: !Ref basicRoleArn\n      Handler: index.handler\n      Code:\n        S3Bucket: !Ref functionsBucket\n        S3Key: !Ref fileName\n      Description: user lambda\n      Timeout: 3\n      MemorySize: 128\n      ReservedConcurrentExecutions: 1\n  MyCustomDomain:\n    Type: \'AWS::ApiGatewayV2::DomainName\'\n    Properties:\n      DomainName: !Ref domainName\n      DomainNameConfigurations:\n        - CertificateArn: !Ref certificateArn\n          SecurityPolicy: tls_1_2\n  MyApiMapping:\n    Type: \'AWS::ApiGatewayV2::ApiMapping\'\n    Properties:\n      ApiId: !Ref apigatewayId\n      DomainName: !Ref MyCustomDomain\n      Stage: !Ref apigatewayStage\n    DependsOn:\n      - MyCustomDomain\n',
            Parameters: [
                {
                    ParameterKey: "functionName",
                    ParameterValue: "slsdz-test-user-functionId",
                },
                {
                    ParameterKey: "basicRoleArn",
                    ParameterValue: "test",
                },
                {
                    ParameterKey: "functionsBucket",
                    ParameterValue: "test",
                },
                {
                    ParameterKey: "fileName",
                    ParameterValue: "functionId.zip",
                },
                {
                    ParameterKey: "apigatewayId",
                    ParameterValue: "test",
                },
                {
                    ParameterKey: "apigatewayStage",
                    ParameterValue: "test",
                },
                {
                    ParameterKey: "certificateArn",
                    ParameterValue: "test",
                },
                {
                    ParameterKey: "domainName",
                    ParameterValue: "functionId.safidev.de",
                },
            ],
            Capabilities: ["CAPABILITY_IAM"],
        });
        expect(result).toBeTruthy();
    });

    it("should handle s3 event - update existing function", async () => {
        mocks.getFunction.mockReturnValue({
            promise: () => Promise.resolve(),
        });

        mocks.updateFunctionCode.mockReturnValue({
            promise: () => Promise.resolve({ message: "test result" }),
        });

        const e = buildS3PutObjectEvent();
        const result = await handler(e, {
            invokedFunctionArn: buildInvokedFunctionArn(),
        } as any);

        expect(mocks.updateFunctionCode).toBeCalledWith({
            FunctionName:
                "arn:aws:lambda:us-east-1:123456789012:function:slsdz-test-user-functionId",
            S3Bucket: "test",
            S3Key: "functionId.zip",
        });

        expect(result).toBeTruthy();
    });
});
