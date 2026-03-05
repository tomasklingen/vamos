import { describe, expect, it } from "vitest"
import { mountSuspended } from "@nuxt/test-utils/runtime"
import { defineComponent, h } from "vue"
import { useI18n } from "#i18n"

function makeNavComponent(targetLocale?: "es" | "en" | "nl") {
	return defineComponent({
		async setup() {
			const { locale, setLocale, t } = useI18n()
			if (targetLocale) await setLocale(targetLocale)
			return () =>
				h("div", { "data-locale": locale.value }, [
					h("span", { id: "home" }, t("nav.home")),
					h("span", { id: "lesson" }, t("nav.lesson")),
					h("span", { id: "cards" }, t("nav.cards")),
				])
		},
	})
}

describe("i18n", () => {
	it("defaults to Spanish", async () => {
		const wrapper = await mountSuspended(makeNavComponent("es"))

		expect(wrapper.get("[data-locale]").attributes("data-locale")).toBe("es")
		expect(wrapper.get("#home").text()).toBe("Inicio")
		expect(wrapper.get("#lesson").text()).toBe("Lección")
		expect(wrapper.get("#cards").text()).toBe("Tarjetas")
	})

	it("switches to English", async () => {
		const wrapper = await mountSuspended(makeNavComponent("en"))

		expect(wrapper.get("[data-locale]").attributes("data-locale")).toBe("en")
		expect(wrapper.get("#home").text()).toBe("Home")
		expect(wrapper.get("#lesson").text()).toBe("Lesson")
		expect(wrapper.get("#cards").text()).toBe("Cards")
	})

	it("switches to Dutch", async () => {
		const wrapper = await mountSuspended(makeNavComponent("nl"))

		expect(wrapper.get("[data-locale]").attributes("data-locale")).toBe("nl")
		expect(wrapper.get("#home").text()).toBe("Home")
		expect(wrapper.get("#lesson").text()).toBe("Les")
		expect(wrapper.get("#cards").text()).toBe("Kaarten")
	})

	it("translates card count with interpolation", async () => {
		const TestComponent = defineComponent({
			async setup() {
				const { setLocale, t } = useI18n()
				await setLocale("es")
				return () => h("span", { id: "count" }, t("cards.count", { n: 5 }))
			},
		})

		const wrapper = await mountSuspended(TestComponent)

		expect(wrapper.get("#count").text()).toBe("5 tarjetas")
	})
})
