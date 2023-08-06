import { describe, expect, it } from "vitest";
import { runSlsDzCli } from "./utils/runSlsDzCli";

describe("--about", () => {
    it("prints open source information and author name", async () => {
        const { code, stdout } = await runSlsDzCli("--about");

        expect(code).toBe(0);
        expect(stdout).toContain("Created by Safi <safidev@proton.me>");
    });
});
