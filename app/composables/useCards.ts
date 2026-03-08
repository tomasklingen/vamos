import { isRef, type MaybeRef } from "vue"

export interface CardData {
	front: string
	back: string
	labels: string[]
}

const modules = import.meta.glob<CardData[]>("../../public/data/*/*.json", {
	eager: true,
	import: "default",
})

const allCardsByLocale: Record<string, CardData[]> = {}
for (const [path, cards] of Object.entries(modules)) {
	const locale = path.split("/").at(-2)!
	allCardsByLocale[locale] ??= []
	allCardsByLocale[locale].push(...cards)
}

export function useCards(label?: MaybeRef<string | undefined>) {
	const { locale } = useI18n()
	const data = computed(() => {
		const cards = allCardsByLocale[locale.value] ?? allCardsByLocale["en"] ?? []
		const l = isRef(label) ? label.value : label
		return l ? cards.filter((c) => c.labels.includes(l)) : cards
	})

	return { data, status: ref<"success" | "pending" | "error">("success") }
}

export function useLabels() {
	const { locale } = useI18n()
	const data = computed(() => {
		const cards = allCardsByLocale[locale.value] ?? allCardsByLocale["en"] ?? []
		return [...new Set(cards.flatMap((c) => c.labels))].map((name) => ({ name }))
	})
	return {
		data,
		status: ref<"success" | "pending" | "error">("success"),
	}
}
