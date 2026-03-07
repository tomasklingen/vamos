import { isRef, type MaybeRef } from "vue"
import cardsJson from "~~/public/data/cards.json"
import labelsJson from "~~/public/data/labels.json"

export interface CardData {
	front: string
	back: string
	labels: string[]
}

export function useCards(label?: MaybeRef<string | undefined>) {
	const allCards = ref<CardData[]>(cardsJson)
	const status = ref<"success" | "pending" | "error">("success" as const)

	const data = computed(() => {
		const l = isRef(label) ? label.value : label
		if (!l) return allCards.value ?? []
		return (allCards.value ?? []).filter((c) => c.labels.includes(l))
	})

	return { data, status }
}

export function useLabels() {
	return {
		data: ref(labelsJson),
		status: ref<"success" | "pending" | "error">("success" as const),
	}
}
