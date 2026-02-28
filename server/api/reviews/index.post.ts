import { Rating } from "ts-fsrs"

export default defineEventHandler(async (event) => {
	const body = await readBody<{ cardId: number; rating: number }>(event)

	if (body.cardId == null || body.rating == null) {
		throw createError({ statusCode: 400, message: "cardId and rating are required" })
	}

	if (body.rating < Rating.Again || body.rating > Rating.Easy) {
		throw createError({
			statusCode: 400,
			message: "rating must be 1 (Again), 2 (Hard), 3 (Good), or 4 (Easy)",
		})
	}

	const db = useDatabase()

	const cardResult = await db.sql`SELECT * FROM cards WHERE id = ${body.cardId}`
	const row = cardResult.rows?.[0] as Record<string, unknown> | undefined
	if (!row) {
		throw createError({ statusCode: 404, message: "Card not found" })
	}

	const card = dbRowToCard(row)
	const result = scheduler.next(card, new Date(), body.rating as Rating)
	const updated = cardToDbFields(result.card)

	await db.sql`UPDATE cards SET
		due = ${updated.due},
		stability = ${updated.stability},
		difficulty = ${updated.difficulty},
		elapsed_days = ${updated.elapsed_days},
		scheduled_days = ${updated.scheduled_days},
		learning_steps = ${updated.learning_steps},
		reps = ${updated.reps},
		lapses = ${updated.lapses},
		state = ${updated.state},
		last_review = ${updated.last_review}
		WHERE id = ${body.cardId}`

	await db.sql`INSERT INTO reviews (card_id, rating) VALUES (${body.cardId}, ${body.rating})`

	return { ok: true }
})
