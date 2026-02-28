export default defineEventHandler(async () => {
	const db = useDatabase()

	const cardsResult = await db.sql`SELECT COUNT(*) AS total FROM cards`
	const reviewsResult =
		await db.sql`SELECT COUNT(*) AS total, SUM(CASE WHEN rating >= 3 THEN 1 ELSE 0 END) AS correct FROM reviews`
	const datesResult = await db.sql`
		SELECT DISTINCT date(reviewed_at) AS day
		FROM reviews
		ORDER BY day DESC
	`

	const totalCards = (cardsResult.rows?.[0] as { total: number } | undefined)?.total ?? 0
	const totalReviews =
		(reviewsResult.rows?.[0] as { total: number; correct: number } | undefined)?.total ?? 0
	const totalCorrect =
		(reviewsResult.rows?.[0] as { total: number; correct: number } | undefined)?.correct ?? 0
	const accuracy = totalReviews > 0 ? Math.round((totalCorrect / totalReviews) * 100) : 0

	// Compute streak: consecutive days from today
	const today = new Date()
	let streak = 0
	const days = (datesResult.rows ?? []) as { day: string }[]

	for (let i = 0; i < days.length; i++) {
		const expected = new Date(today)
		expected.setDate(today.getDate() - i)
		const expectedStr = expected.toISOString().slice(0, 10)
		if (days[i]?.day === expectedStr) {
			streak++
		} else {
			break
		}
	}

	return { totalCards, totalReviews, accuracy, streak }
})
