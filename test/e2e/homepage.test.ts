/**
 * Browser E2E tests for the exercise mode homepage + lesson pages.
 *
 * Uses @nuxt/test-utils/e2e to start a real Nuxt dev server and drive
 * headless Chromium via playwright-core. Vitest handles the test runner;
 * expect() is imported from @playwright/test to get the Playwright locator
 * matchers (.toBeVisible, .toHaveCount, .toHaveAttribute, etc.).
 *
 * The app defaults to Spanish. We force English by setting the i18n_locale
 * cookie before the first navigation so assertions use readable English text.
 *
 * Run with: npm run test:e2e
 */
import { fileURLToPath } from "node:url"
import { describe, it } from "vitest"
import { setup, createPage, url } from "@nuxt/test-utils/e2e"
import { expect } from "@playwright/test"
import type { Page } from "playwright-core"

await setup({
	rootDir: fileURLToPath(new URL("../..", import.meta.url)),
	dev: true,
	browserOptions: {
		type: "chromium",
		launch: { headless: true },
	},
})

/**
 * Create a Playwright page with English locale forced via i18n_locale cookie.
 * The cookie is set before the first navigation using the patched page.goto
 * from @nuxt/test-utils which waits for Nuxt hydration.
 */
async function createEnPage(path: string): Promise<Page> {
	// createPage() with no arg patches page.goto but skips initial navigation
	const page = await createPage()
	const { hostname } = new URL(url("/"))
	await page
		.context()
		.addCookies([{ name: "i18n_locale", value: "en", domain: hostname, path: "/" }])
	// "hydration" is handled by @nuxt/test-utils's patched page.goto
	await page.goto(url(path), { waitUntil: "hydration" } as Parameters<typeof page.goto>[1])
	return page
}

// ---------------------------------------------------------------------------
// Content set selector
// ---------------------------------------------------------------------------

describe("homepage — content set selector", () => {
	it("shows Mix button and label buttons", async () => {
		const page = await createEnPage("/")

		await expect(page.getByRole("button", { name: "Mix" })).toBeVisible()
		await expect(page.getByRole("button", { name: "greeting" })).toBeVisible()

		await page.close()
	})

	it("selecting a label adds it to the lesson link; deselecting removes it", async () => {
		const page = await createEnPage("/")

		await page.getByRole("button", { name: "greeting" }).click()
		const link = page.locator("a", { hasText: "Recognition" })
		await expect(link).toHaveAttribute("href", /label=greeting/)

		await page.getByRole("button", { name: "greeting" }).click()
		await expect(link).not.toHaveAttribute("href", /label=/)

		await page.close()
	})
})

// ---------------------------------------------------------------------------
// Skill rings / progress section
// ---------------------------------------------------------------------------

describe("homepage — skill rings", () => {
	it("renders Your Progress section with all 4 mode rows", async () => {
		const page = await createEnPage("/")

		await expect(page.getByText("Your Progress")).toBeVisible()
		await expect(page.getByText("Recognition")).toBeVisible()
		await expect(page.getByText("Active Recall")).toBeVisible()
		await expect(page.getByText("Production")).toBeVisible()
		await expect(page.getByText("Dictation")).toBeVisible()

		await page.close()
	})

	it("shows exactly 2 Coming soon badges (Production + Dictation)", async () => {
		const page = await createEnPage("/")

		await expect(page.getByText("Your Progress")).toBeVisible()
		await expect(page.getByText("Coming soon")).toHaveCount(2)

		await page.close()
	})

	it("Recognition row is a link to forward mode; Production is not a link", async () => {
		const page = await createEnPage("/")

		await expect(page.locator("a", { hasText: "Recognition" })).toHaveAttribute(
			"href",
			/mode=forward/,
		)
		await expect(page.locator("a", { hasText: "Production" })).toHaveCount(0)

		await page.close()
	})

	it("navigates to /lesson?mode=forward when clicking Recognition", async () => {
		const page = await createEnPage("/")
		await page.locator("a", { hasText: "Recognition" }).click()
		await page.waitForURL(/\/lesson/)
		expect(page.url()).toContain("mode=forward")
		await page.close()
	})

	it("navigates to /lesson?mode=backward when clicking Active Recall", async () => {
		const page = await createEnPage("/")
		await page.locator("a", { hasText: "Active Recall" }).click()
		await page.waitForURL(/\/lesson/)
		expect(page.url()).toContain("mode=backward")
		await page.close()
	})

	it("includes label param when a label is selected before navigating", async () => {
		const page = await createEnPage("/")
		await page.getByRole("button", { name: "greeting" }).click()
		await page.locator("a", { hasText: "Active Recall" }).click()
		await page.waitForURL(/\/lesson/)
		expect(page.url()).toContain("mode=backward")
		expect(page.url()).toContain("label=greeting")
		await page.close()
	})
})

// ---------------------------------------------------------------------------
// Lesson — forward mode
// ---------------------------------------------------------------------------

describe("lesson — forward mode", () => {
	it("shows Spanish as question header, Translation after reveal", async () => {
		const page = await createEnPage("/lesson?mode=forward")

		await expect(page.getByText("Spanish")).toBeVisible()
		await expect(page.getByText("Translation")).not.toBeVisible()

		await page.getByRole("button", { name: "Show answer" }).click()

		await expect(page.getByText("Translation")).toBeVisible()

		await page.close()
	})
})

// ---------------------------------------------------------------------------
// Lesson — backward mode
// ---------------------------------------------------------------------------

describe("lesson — backward mode", () => {
	it("shows Translation as question header, Spanish after reveal", async () => {
		const page = await createEnPage("/lesson?mode=backward")

		await expect(page.getByText("Translation")).toBeVisible()
		await expect(page.getByText("Spanish")).not.toBeVisible()

		await page.getByRole("button", { name: "Show answer" }).click()

		await expect(page.getByText("Spanish")).toBeVisible()

		await page.close()
	})

	it("question is native-lang word; answer is the Spanish word", async () => {
		const page = await createEnPage("/lesson?mode=backward&label=greeting")

		// First greeting card: front="Hola", back="Hello"
		// In backward mode: question (front) = "Hello", answer (back) = "Hola"
		await expect(page.getByText("Hello")).toBeVisible()

		await page.getByRole("button", { name: "Show answer" }).click()

		await expect(page.locator(".text-secondary")).toHaveText("Hola")

		await page.close()
	})
})
