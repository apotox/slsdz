import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        watch: false,
        globals: true,
        root: "./tests",
        environment: "node",
        setupFiles: ["./vitest.setup.ts"],
    },
});
