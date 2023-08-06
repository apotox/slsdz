import { describe, expect, it } from "vitest";
import fs from "fs/promises";
import path from "path";
import { runSlsDzCli } from "./utils/runSlsDzCli";

describe("--init", () => {
    it("should init new function", async () => {
        const { code, stdout } = await runSlsDzCli("--init");
        expect(code).toBe(0);
        expect(stdout).toContain("✔ initializing new slsdz function");
        const slsdzContent = await fs.readFile(
            path.resolve(__dirname, "../.slsdz"),
        );

        expect(String(slsdzContent)).toEqual(
            // eslint-disable-next-line quotes
            '{"id":"function-id","secret":"secret"}',
        );
    });
});
