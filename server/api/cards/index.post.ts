export default defineEventHandler(async (event) => {
	const body = await readBody<{ front: string; back: string; category?: string }>(event)

	if (!body.front?.trim() || !body.back?.trim()) {
		throw createError({ statusCode: 400, message: "front and back are required" })
	}

	const db = useDatabase()
	const category = body.category ?? "custom"

	await db.sql`INSERT OR IGNORE INTO cards (front, back, category) VALUES (${body.front.trim()}, ${body.back.trim()}, ${category})`

	return { ok: true }
})
