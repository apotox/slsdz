import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
    return {
        getSignedUrl: vi.fn(),
    };
});

vi.mock("aws-sdk/clients/s3", () => {
    const SomeClass = vi.fn(() => ({
        getSignedUrl: mocks.getSignedUrl,
    }));

    return {
        default: SomeClass,
    };
});

import { handler } from "../src/signer";
import { generateSignature, verifySignature } from "../src/common/crypt";
import { generateRandomString } from "../src/common/helpers";

describe("test signer function", () => {
    it("should handle http request", async () => {
        mocks.getSignedUrl.mockReturnValue("https://signed");

        const id = generateRandomString();
        const secret = generateSignature(id, "secret");

        const result = await handler({
            queryStringParameters: {
                id,
                secret,
            },
        } as any);

        expect(result.statusCode).toBe(200);
    });

    it("should return 401 when secret is incorrect", async () => {
        mocks.getSignedUrl.mockReturnValue("https://signed");

        const id = generateRandomString();

        const result = await handler({
            queryStringParameters: {
                id,
                secret: "random-secret",
            },
        } as any);

        expect(result.statusCode).toBe(401);
    });

    it("should return new credentials", async () => {
        mocks.getSignedUrl.mockReturnValue("https://signed");

        const result = await handler({} as any);

        expect(result.statusCode).toBe(200);
        expect(result.body).toBeTruthy();

        const parsedBody = JSON.parse(result.body!);
        expect(parsedBody).toEqual({
            url: "https://signed",
            id: expect.any(String),
            secret: expect.any(String),
        });

        expect(verifySignature(parsedBody.secret, parsedBody.id, "secret"));
    });
});
