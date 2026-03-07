import { createEmptyCard, type Card as FsrsCard, type Grade } from "ts-fsrs"
import type { MaybeRef } from "vue"
import type { CardScheduling, ExerciseMode } from "~/utils/db"
import { db } from "~/utils/db"
import { scheduler, computeIntervals, cardToDbFields } from "~/utils/fsrs"
import { useCards, type CardData } from "~/composables/useCards"

const DAILY_NEW_LIMIT = 50

export interface LessonCard {
	cardKey: string
	front: string
	back: string
	labels: string[]
	state: number
	mode: ExerciseMode
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

export function useLesson(label?: MaybeRef<string | undefined>, mode?: MaybeRef<ExerciseMode>) {
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

		const activeMode = toValue(mode) ?? "forward"
		const cardKeys = cards.map(
			(c) => [`${c.front}|${c.back}`, activeMode] as [string, ExerciseMode],
		)
		const schedulingRows = await db.cardScheduling.bulkGet(cardKeys)

		const now = new Date()
		const todayStart = new Date()
		todayStart.setHours(0, 0, 0, 0)
		const todayStartStr = todayStart.toISOString()
		const todayReviews = await db.reviews
			.filter((r) => r.mode === activeMode && r.reviewed_at >= todayStartStr)
			.toArray()
		const todayCountByKey = new Map<string, number>()
		for (const r of todayReviews) {
			todayCountByKey.set(r.cardKey, (todayCountByKey.get(r.cardKey) ?? 0) + 1)
		}

		const reviewDueCards: Array<{ apiCard: CardData; fsrsCard: FsrsCard }> = []
		const newCards: Array<{ apiCard: CardData; fsrsCard: FsrsCard }> = []
		let introducedTodayCount = 0

		for (let i = 0; i < cards.length; i++) {
			const apiCard = cards[i]!
			const scheduling = schedulingRows[i]
			const fsrsCard = scheduling ? schedulingToFsrsCard(scheduling) : createEmptyCard(now)

			if (!scheduling) {
				newCards.push({ apiCard, fsrsCard })
			} else {
				const todayCount = todayCountByKey.get(`${apiCard.front}|${apiCard.back}`) ?? 0
				if (scheduling.reps > 0 && scheduling.reps === todayCount) {
					introducedTodayCount++
				}
				if (fsrsCard.due <= now) {
					reviewDueCards.push({ apiCard, fsrsCard })
				}
			}
		}

		const availableNewCount = Math.max(0, DAILY_NEW_LIMIT - introducedTodayCount)
		dueCount.value = reviewDueCards.length + Math.min(newCards.length, availableNewCount)

		if (dueCount.value === 0) {
			nextCard.value = null
			return
		}

		let chosen: { apiCard: CardData; fsrsCard: FsrsCard }

		if (reviewDueCards.length > 0) {
			reviewDueCards.sort((a, b) => a.fsrsCard.due.getTime() - b.fsrsCard.due.getTime())
			chosen = reviewDueCards[0]!
		} else {
			const idx = Math.floor(Math.random() * Math.min(newCards.length, availableNewCount))
			chosen = newCards[idx]!
		}

		const { apiCard, fsrsCard } = chosen
		const intervals = computeIntervals(fsrsCard, now)
		const cardKey = `${apiCard.front}|${apiCard.back}`
		const isBackward = activeMode === "backward"

		nextCard.value = {
			cardKey,
			front: isBackward ? apiCard.back : apiCard.front,
			back: isBackward ? apiCard.front : apiCard.back,
			labels: apiCard.labels,
			state: fsrsCard.state,
			mode: activeMode,
			intervals,
		}
	}

	async function submitReview(cardKey: string, rating: number) {
		const activeMode = toValue(mode) ?? "forward"
		const existing = await db.cardScheduling.get([cardKey, activeMode])
		const fsrsCard = existing ? schedulingToFsrsCard(existing) : createEmptyCard(new Date())

		const now = new Date()
		const result = scheduler.next(fsrsCard, now, rating as Grade)
		const updated = cardToDbFields(result.card)

		const scheduling: CardScheduling = { cardKey, mode: activeMode, ...updated }
		await db.cardScheduling.put(scheduling)
		await db.reviews.add({ cardKey, mode: activeMode, rating, reviewed_at: now.toISOString() })

		await computeNextCard()
	}

	const loading = ref(true)

	async function refresh() {
		await computeNextCard()
	}

	onMounted(async () => {
		await computeNextCard()
		loading.value = false
	})

	watch(apiCards, async () => {
		await computeNextCard()
	})

	return { nextCard, dueCount, status, loading, submitReview, refresh }
}
