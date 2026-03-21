import { describe, expect, it } from "vitest"
import { mountSuspended } from "@nuxt/test-utils/runtime"
import { defineComponent, h } from "vue"
import { useI18n } from "#i18n"

function makeNavComponent() {
	return defineComponent({
		async setup() {
			const { locale, t } = useI18n()
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
	it("defaults to Dutch", async () => {
		const wrapper = await mountSuspended(makeNavComponent())

		expect(wrapper.get("[data-locale]").attributes("data-locale")).toBe("nl")
		expect(wrapper.get("#home").text()).toBe("Home")
		expect(wrapper.get("#lesson").text()).toBe("Les")
		expect(wrapper.get("#cards").text()).toBe("Kaarten")
	})

	it("translates card count with interpolation", async () => {
		const TestComponent = defineComponent({
			async setup() {
				const { t } = useI18n()
				return () => h("span", { id: "count" }, t("cards.count", { n: 5 }))
			},
		})

		const wrapper = await mountSuspended(TestComponent)

		expect(wrapper.get("#count").text()).toBe("5 kaarten")
	})
})
