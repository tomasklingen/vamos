import { isRef, type MaybeRef } from "vue"

export interface CardData {
	front: string
	back: string
	labels: string[]
}

export interface LessonData {
	id: string
	description?: string
	subjects: string[]
}

const modules = import.meta.glob<CardData[]>("../../public/data/*/*.json", {
	eager: true,
	import: "default",
})

const lessonModules = import.meta.glob<LessonData[]>("../../public/data/*/lessons.json", {
	eager: true,
	import: "default",
})

const allCardsByLocale: Record<string, CardData[]> = {}
for (const [path, cards] of Object.entries(modules)) {
	const parts = path.split("/")
	const filename = parts.at(-1)!
	if (filename === "lessons.json") continue
	const locale = parts.at(-2)!
	allCardsByLocale[locale] ??= []
	allCardsByLocale[locale].push(...cards)
}

const allLessonsByLocale: Record<string, LessonData[]> = {}
for (const [path, lessons] of Object.entries(lessonModules)) {
	const locale = path.split("/").at(-2)!
	allLessonsByLocale[locale] = lessons
}

export function useCards(label?: MaybeRef<string | string[] | undefined>) {
	const { locale } = useI18n()
	const data = computed(() => {
		const cards = allCardsByLocale[locale.value] ?? allCardsByLocale["en"] ?? []
		const l = isRef(label) ? label.value : label
		if (!l || (Array.isArray(l) && l.length === 0)) return cards
		if (Array.isArray(l)) return cards.filter((c) => l.some((lbl) => c.labels.includes(lbl)))
		return cards.filter((c) => c.labels.includes(l))
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

export function useLessons() {
	const { locale } = useI18n()
	const data = computed(() => allLessonsByLocale[locale.value] ?? [])
	return { data }
}
