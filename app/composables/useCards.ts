import { isRef, type MaybeRef } from "vue"

export interface CardData {
	front: string
	back: string
	labels: string[]
}

const modules = import.meta.glob<CardData[]>("../../public/data/*.json", {
	eager: true,
	import: "default",
})

export const allCards: CardData[] = Object.values(modules).flat()

export function useCards(label?: MaybeRef<string | undefined>) {
	const data = computed(() => {
		const l = isRef(label) ? label.value : label
		if (!l) return allCards
		return allCards.filter((c) => c.labels.includes(l))
	})

	return { data, status: ref<"success" | "pending" | "error">("success") }
}

export function useLabels() {
	const labels = [...new Set(allCards.flatMap((c) => c.labels))].map((name) => ({ name }))
	return {
		data: ref(labels),
		status: ref<"success" | "pending" | "error">("success"),
	}
}
