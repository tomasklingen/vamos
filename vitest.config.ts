import { fileURLToPath } from "node:url"
import { defineConfig, defineProject } from "vitest/config"
import { defineVitestProject } from "@nuxt/test-utils/config"
import { playwright } from "@vitest/browser-playwright"

export default defineConfig({
	test: {
		projects: [
			await defineVitestProject({
				test: {
					name: "nuxt",
					include: ["test/nuxt/*.{test,spec}.ts"],
					environment: "nuxt",
					environmentOptions: {
						nuxt: {
							rootDir: fileURLToPath(new URL(".", import.meta.url)),
						},
					},
					browser: {
						enabled: true,
						provider: playwright(),
						instances: [{ browser: "chromium" }],
					},
				},
			}),
			defineProject({
				test: {
					name: "e2e",
					include: ["test/e2e/*.{test,spec}.ts"],
					environment: "node",
					testTimeout: 120_000,
				},
			}),
		],
	},
})
