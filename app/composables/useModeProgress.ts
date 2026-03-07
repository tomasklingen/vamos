import type { MaybeRef } from "vue"
import type { ExerciseMode } from "~/utils/db"
import { db } from "~/utils/db"
import { useCards } from "~/composables/useCards"

export interface ModeProgress {
	total: number
	mature: number
	percentage: number
	dueCount: number
}

const MODES: ExerciseMode[] = ["forward", "backward", "production", "dictation"]

export function useModeProgress(label?: MaybeRef<string | undefined>) {
	const { data: cards } = useCards(label)

	const progress = ref<Record<ExerciseMode, ModeProgress>>({
		forward: { total: 0, mature: 0, percentage: 0, dueCount: 0 },
		backward: { total: 0, mature: 0, percentage: 0, dueCount: 0 },
		production: { total: 0, mature: 0, percentage: 0, dueCount: 0 },
		dictation: { total: 0, mature: 0, percentage: 0, dueCount: 0 },
	})

	async function compute() {
		const cardList = cards.value ?? []
		const total = cardList.length
		if (total === 0) {
			for (const mode of MODES) {
				progress.value[mode] = { total: 0, mature: 0, percentage: 0, dueCount: 0 }
			}
			return
		}

		const cardKeys = cardList.map((c) => `${c.front}|${c.back}`)
		const now = new Date()

		for (const mode of MODES) {
			const keys = cardKeys.map((k) => [k, mode] as [string, ExerciseMode])
			const rows = await db.cardScheduling.bulkGet(keys)

			let mature = 0
			let dueCount = 0

			for (const row of rows) {
				if (!row) {
					dueCount++ // new card = due
					continue
				}
				if (row.state === 2) mature++
				if (new Date(row.due) <= now) dueCount++
			}

			progress.value[mode] = {
				total,
				mature,
				percentage: Math.round((mature / total) * 100),
				dueCount,
			}
		}
	}

	onMounted(async () => {
		await compute()
	})

	watch(cards, async () => {
		await compute()
	})

	return { progress, refresh: compute }
}
