vi.mock("axios");
import { MockedFunction, describe, expect, it, vi } from "vitest";
import Axios from "axios";

import { handler } from "../src/cname";
import { buildEventBridge } from "./fixtures";
const postMock = Axios.post as MockedFunction<typeof Axios.post>;

describe("test cname", () => {
    it("should call cloudflare api", async () => {
        const e = buildEventBridge();
        await handler(e);

        expect(postMock.mock.calls[0][0]).toEqual(
            "https://api.cloudflare.com/client/v4/zones/test-zone-id/dns_records",
        );

        expect(postMock.mock.calls[0][1]).toContain({
            name: "FUNCTION_ID",
            type: "CNAME",
        });
    });
});
