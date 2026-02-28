export default defineEventHandler(async () => {
	const db = useDatabase()

	const result = await db.sql`
		SELECT * FROM cards
		WHERE due <= datetime('now')
		ORDER BY due ASC
		LIMIT 1
	`

	const row = result.rows?.[0] as Record<string, unknown> | undefined
	if (!row) return null

	const countResult = await db.sql`SELECT COUNT(*) AS count FROM cards WHERE due <= datetime('now')`
	const dueCount = (countResult.rows?.[0] as { count: number } | undefined)?.count ?? 0

	const card = dbRowToCard(row)
	const now = new Date()
	const intervals = computeIntervals(card, now)

	return { ...row, intervals, dueCount }
})
