import { createEmptyCard, type Card as FsrsCard, type Grade } from "ts-fsrs"
import type { MaybeRef } from "vue"
import type { CardScheduling } from "~/utils/db"
import { db } from "~/utils/db"
import { scheduler, computeIntervals, cardToDbFields } from "~/utils/fsrs"
import { useCards, type CardData } from "~/composables/useCards"

export interface LessonCard {
	cardKey: string
	front: string
	back: string
	labels: string[]
	state: number
	intervals: { again: string; hard: string; good: string; easy: string }
}

function schedulingToFsrsCard(s: CardScheduling): FsrsCard {
	return {
		due: new Date(s.due),
		stability: s.stability,
		difficulty: s.difficulty,
		elapsed_days: s.elapsed_days,
		scheduled_days: s.scheduled_days,
		learning_steps: s.learning_steps,
		reps: s.reps,
		lapses: s.lapses,
		state: s.state,
		last_review: s.last_review ? new Date(s.last_review) : undefined,
	}
}

export function useLesson(label?: MaybeRef<string | undefined>) {
	const { data: apiCards, status } = useCards(label)
	const nextCard = ref<LessonCard | null>(null)
	const dueCount = ref(0)

	async function computeNextCard() {
		const cards = apiCards.value ?? []
		if (cards.length === 0) {
			nextCard.value = null
			dueCount.value = 0
			return
		}

		const cardKeys = cards.map(
			(c) => [`${c.front}|${c.back}`, "forward" as const] as [string, "forward"],
		)
		const schedulingRows = await db.cardScheduling.bulkGet(cardKeys)

		const now = new Date()
		const dueCards: Array<{ apiCard: CardData; fsrsCard: FsrsCard }> = []

		for (let i = 0; i < cards.length; i++) {
			const apiCard = cards[i]!
			const scheduling = schedulingRows[i]
			const fsrsCard = scheduling ? schedulingToFsrsCard(scheduling) : createEmptyCard(now)
			if (fsrsCard.due <= now) {
				dueCards.push({ apiCard, fsrsCard })
			}
		}

		dueCount.value = dueCards.length

		if (dueCards.length === 0) {
			nextCard.value = null
			return
		}

		dueCards.sort((a, b) => a.fsrsCard.due.getTime() - b.fsrsCard.due.getTime())
		const { apiCard, fsrsCard } = dueCards[0]!
		const intervals = computeIntervals(fsrsCard, now)
		const cardKey = `${apiCard.front}|${apiCard.back}`

		nextCard.value = {
			cardKey,
			front: apiCard.front,
			back: apiCard.back,
			labels: apiCard.labels,
			state: fsrsCard.state,
			intervals,
		}
	}

	async function submitReview(cardKey: string, rating: number) {
		const mode = "forward" as const
		const existing = await db.cardScheduling.get([cardKey, mode])
		const fsrsCard = existing ? schedulingToFsrsCard(existing) : createEmptyCard(new Date())

		const now = new Date()
		const result = scheduler.next(fsrsCard, now, rating as Grade)
		const updated = cardToDbFields(result.card)

		const scheduling: CardScheduling = { cardKey, mode, ...updated }
		await db.cardScheduling.put(scheduling)
		await db.reviews.add({ cardKey, mode, rating, reviewed_at: now.toISOString() })

		await computeNextCard()
	}

	async function refresh() {
		if (!import.meta.client) return
		await computeNextCard()
	}

	watch(
		apiCards,
		async () => {
			if (!import.meta.client) return
			await computeNextCard()
		},
		{ immediate: true },
	)

	return { nextCard, dueCount, status, submitReview, refresh }
}
