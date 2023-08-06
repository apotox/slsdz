import { beforeEach, describe, expect, it } from "vitest";
import { runSlsDzCli } from "./utils/runSlsDzCli";

describe("deploy function", () => {
    beforeEach(async () => {
        await runSlsDzCli("--init");
    });

    it("should deploy function.zip using --f", async () => {
        const { code, stdout } = await runSlsDzCli(
            "-f ./tests/fixtures/function.zip",
        );
        expect(code).toBe(0);
        expect(stdout).toContain(
            "your function URL 🚀 https://function-id.safidev.de",
        );
        expect(stdout).toContain("✔ ☁️  uploading");
    });

    it("should deploy function.zip using --zip", async () => {
        const { code, stdout } = await runSlsDzCli(
            "--zip ./tests/fixtures/function.zip",
        );
        expect(code).toBe(0);
        expect(stdout).toContain(
            "your function URL 🚀 https://function-id.safidev.de",
        );
        expect(stdout).toContain("✔ ☁️  uploading");
    });
});
