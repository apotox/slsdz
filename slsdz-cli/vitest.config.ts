import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        watch: false,
        reporters: ["verbose"],
        globals: true,
        root: "./tests",
        environment: "node",
        globalSetup: ["./tests/setup.ts"],
    },
});
