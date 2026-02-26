export default defineEventHandler(async () => {
	const db = useDatabase()

	const result = await db.sql`
		SELECT c.*,
			COALESCE(SUM(r.correct), 0) AS correct_count,
			MAX(r.reviewed_at) AS last_reviewed
		FROM cards c
		LEFT JOIN reviews r ON r.card_id = c.id
		GROUP BY c.id
		ORDER BY correct_count ASC, last_reviewed ASC NULLS FIRST
		LIMIT 1
	`

	return result.rows?.[0] ?? null
})
