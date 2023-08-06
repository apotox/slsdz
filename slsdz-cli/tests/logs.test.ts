import { beforeEach, describe, expect, it } from "vitest";
import { runSlsDzCli } from "./utils/runSlsDzCli";

describe("--log", () => {
    beforeEach(async () => {
        await runSlsDzCli("--init");
    });
    it("should return function logs", async () => {
        const { code, stdout } = await runSlsDzCli("--log");
        expect(code).toBe(0);
        expect(stdout).toContain("test message log 1");
        expect(stdout).toContain("test message log 2");
    });
});
