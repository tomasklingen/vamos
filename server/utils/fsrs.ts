import { fsrs, Rating, type Card } from "ts-fsrs"

export const scheduler = fsrs({
	request_retention: 0.9,
	maximum_interval: 365,
	enable_fuzz: true,
})

export function dbRowToCard(row: Record<string, unknown>): Card {
	return {
		due: new Date(row.due as string),
		stability: row.stability as number,
		difficulty: row.difficulty as number,
		elapsed_days: row.elapsed_days as number,
		scheduled_days: row.scheduled_days as number,
		learning_steps: row.learning_steps as number,
		reps: row.reps as number,
		lapses: row.lapses as number,
		state: row.state as number,
		last_review: row.last_review ? new Date(row.last_review as string) : undefined,
	}
}

export function formatInterval(scheduledCard: Card, now: Date): string {
	const diffMs = scheduledCard.due.getTime() - now.getTime()
	const diffMins = Math.round(diffMs / 60_000)
	const diffDays = scheduledCard.scheduled_days

	if (diffMins < 1) return "<1m"
	if (diffMins < 60) return `${diffMins}m`
	if (diffMins < 1440) return `${Math.round(diffMins / 60)}h`
	if (diffDays < 30) return `${diffDays}d`
	if (diffDays < 365) return `${Math.round(diffDays / 30)}mo`
	return `${Math.round(diffDays / 365)}y`
}

export function computeIntervals(card: Card, now: Date) {
	const outcomes = scheduler.repeat(card, now)
	return {
		again: formatInterval(outcomes[Rating.Again].card, now),
		hard: formatInterval(outcomes[Rating.Hard].card, now),
		good: formatInterval(outcomes[Rating.Good].card, now),
		easy: formatInterval(outcomes[Rating.Easy].card, now),
	}
}

export function cardToDbFields(card: Card) {
	return {
		due: card.due.toISOString(),
		stability: card.stability,
		difficulty: card.difficulty,
		elapsed_days: card.elapsed_days,
		scheduled_days: card.scheduled_days,
		learning_steps: card.learning_steps,
		reps: card.reps,
		lapses: card.lapses,
		state: card.state,
		last_review: card.last_review?.toISOString() ?? null,
	}
}
