/**
 * Browser E2E tests for the homepage + lesson pages.
 *
 * Uses @nuxt/test-utils/e2e to start a real Nuxt dev server and drive
 * headless Chromium via playwright-core. The app defaults to Dutch (nl).
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

async function createNlPage(path: string): Promise<Page> {
	const page = await createPage()
	await page.goto(url(path), { waitUntil: "hydration" } as Parameters<typeof page.goto>[1])
	return page
}

// ---------------------------------------------------------------------------
// Content set selector
// ---------------------------------------------------------------------------

describe("homepage — content set selector", () => {
	it("shows lesson cards that can be expanded to reveal subject buttons", async () => {
		const page = await createNlPage("/")

		// "Alle onderwerpen" selector should be visible
		await expect(page.getByText("Alle onderwerpen")).toBeVisible()
		// Les 1 should be visible as a lesson card
		await expect(page.getByText("les 1")).toBeVisible()

		// Expand les 1 to reveal subject buttons
		await page.getByText("les 1").click()
		await expect(page.getByRole("button", { name: "begroeting" })).toBeVisible()

		await page.close()
	})

	it("selecting a label adds it to the lesson link; deselecting removes it", async () => {
		const page = await createNlPage("/")

		// Expand les 1 first
		await page.getByText("les 1").click()
		await page.getByRole("button", { name: "begroeting" }).click()

		const link = page.locator("a", { hasText: "ES → NL" })
		await expect(link).toHaveAttribute("href", /label=begroeting/)

		// Deselect
		await page.getByRole("button", { name: "begroeting" }).click()
		await expect(link).not.toHaveAttribute("href", /label=/)

		await page.close()
	})
})

// ---------------------------------------------------------------------------
// Progress section
// ---------------------------------------------------------------------------

describe("homepage — progress", () => {
	it("renders progress section with all 4 mode rows", async () => {
		const page = await createNlPage("/")

		await expect(page.getByText("Oefenen")).toBeVisible()
		await expect(page.getByText("ES → NL")).toBeVisible()
		await expect(page.getByText("NL → ES")).toBeVisible()
		await expect(page.getByText("Productie")).toBeVisible()
		await expect(page.getByText("Dictee")).toBeVisible()

		await page.close()
	})

	it("shows exactly 2 Binnenkort badges (Productie + Dictee)", async () => {
		const page = await createNlPage("/")

		await expect(page.getByText("Oefenen")).toBeVisible()
		await expect(page.getByText("Binnenkort")).toHaveCount(2)

		await page.close()
	})

	it("ES → NL row is a link to forward mode; Productie is not a link", async () => {
		const page = await createNlPage("/")

		await expect(page.locator("a", { hasText: "ES → NL" })).toHaveAttribute("href", /mode=forward/)
		await expect(page.locator("a", { hasText: "Productie" })).toHaveCount(0)

		await page.close()
	})

	it("navigates to /lesson?mode=forward when clicking ES → NL", async () => {
		const page = await createNlPage("/")
		await page.locator("a", { hasText: "ES → NL" }).click()
		await page.waitForURL(/\/lesson/)
		expect(page.url()).toContain("mode=forward")
		await page.close()
	})

	it("navigates to /lesson?mode=backward when clicking NL → ES", async () => {
		const page = await createNlPage("/")
		await page.locator("a", { hasText: "NL → ES" }).click()
		await page.waitForURL(/\/lesson/)
		expect(page.url()).toContain("mode=backward")
		await page.close()
	})

	it("includes label param when a label is selected before navigating", async () => {
		const page = await createNlPage("/")

		// Expand les 1 and select begroeting
		await page.getByText("les 1").click()
		await page.getByRole("button", { name: "begroeting" }).click()

		await page.locator("a", { hasText: "NL → ES" }).click()
		await page.waitForURL(/\/lesson/)
		expect(page.url()).toContain("mode=backward")
		expect(page.url()).toContain("label=begroeting")
		await page.close()
	})
})

// ---------------------------------------------------------------------------
// Lesson — forward mode
// ---------------------------------------------------------------------------

describe("lesson — forward mode", () => {
	it("shows Spaans as question header, Vertaling after reveal", async () => {
		const page = await createNlPage("/lesson?mode=forward")

		// Use exact text match to avoid matching hint text
		await expect(page.getByText("Spaans", { exact: true })).toBeVisible()
		await expect(page.getByText("Vertaling", { exact: true })).not.toBeVisible()

		await page.getByRole("button", { name: "Toon antwoord" }).click()

		await expect(page.getByText("Vertaling", { exact: true })).toBeVisible()

		await page.close()
	})
})

// ---------------------------------------------------------------------------
// Lesson — backward mode
// ---------------------------------------------------------------------------

describe("lesson — backward mode", () => {
	it("shows Vertaling as question header, Spaans after reveal", async () => {
		const page = await createNlPage("/lesson?mode=backward")

		await expect(page.getByText("Vertaling", { exact: true })).toBeVisible()
		await expect(page.getByText("Spaans", { exact: true })).not.toBeVisible()

		await page.getByRole("button", { name: "Toon antwoord" }).click()

		await expect(page.getByText("Spaans", { exact: true })).toBeVisible()

		await page.close()
	})

	it("question and answer show distinct non-empty text from the card fields", async () => {
		const page = await createNlPage("/lesson?mode=backward&label=begroeting")

		const showAnswerBtn = page.getByRole("button", { name: "Toon antwoord" })
		await showAnswerBtn.waitFor({ state: "visible" })

		const questionText = await page.locator(".text-primary").first().innerText()
		expect(questionText.trim()).not.toBe("")

		await showAnswerBtn.click()

		const answerText = await page.locator(".text-secondary").first().innerText()
		expect(answerText.trim()).not.toBe("")

		expect(questionText.trim()).not.toBe(answerText.trim())

		await page.close()
	})
})
