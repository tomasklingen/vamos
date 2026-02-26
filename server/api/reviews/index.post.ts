export default defineEventHandler(async (event) => {
	const body = await readBody<{ cardId: number; correct: boolean }>(event)

	if (body.cardId == null || body.correct == null) {
		throw createError({ statusCode: 400, message: "cardId and correct are required" })
	}

	const db = useDatabase()
	const correctInt = body.correct ? 1 : 0

	await db.sql`INSERT INTO reviews (card_id, correct) VALUES (${body.cardId}, ${correctInt})`

	return { ok: true }
})
