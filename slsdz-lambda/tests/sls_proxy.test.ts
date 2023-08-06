import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
    return {
        invoke: vi.fn(),
    };
});

vi.mock("aws-sdk/clients/lambda", () => {
    const SomeClass = vi.fn(() => ({
        invoke: mocks.invoke,
    }));

    return {
        default: SomeClass,
    };
});

import { handler } from "../src/sls_proxy";
import { buildInvokedFunctionArn } from "./fixtures";

describe("test sls_proxy function", () => {
    it("should handle http request", async () => {
        mocks.invoke.mockReturnValue({
            promise: () =>
                Promise.resolve({
                    Payload: JSON.stringify({
                        statusCode: 200,
                        body: "hello from user function",
                    }),
                }),
        });

        const result = await handler(
            {
                requestContext: {
                    domainName: "test.safidev.de",
                    domainPrefix: "test",
                },
            } as any,
            {
                invokedFunctionArn: buildInvokedFunctionArn(),
            } as any,
        );

        expect(mocks.invoke).toBeCalledWith({
            FunctionName:
                "arn:aws:lambda:us-east-1:123456789012:function:slsdz-test-user-test",
            InvocationType: "RequestResponse",
            LogType: "Tail",
            Payload: "{}",
        });

        expect(result.statusCode).toBe(200);
        expect(result.body).toBe("hello from user function");
    });
});
