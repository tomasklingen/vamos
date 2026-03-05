export default defineEventHandler(async (event) => {
	const query = getQuery(event)
	const label = typeof query.label === "string" ? query.label : undefined
	const db = useDatabase()

	let cardsResult
	if (label) {
		cardsResult = await db.sql`
			SELECT c.id, c.front, c.back, c.created_at
			FROM cards c
			WHERE EXISTS (
				SELECT 1 FROM card_labels cl
				JOIN labels l ON l.id = cl.label_id
				WHERE cl.card_id = c.id AND l.name = ${label}
			)
			ORDER BY c.created_at DESC
		`
	} else {
		cardsResult =
			await db.sql`SELECT id, front, back, created_at FROM cards ORDER BY created_at DESC`
	}

	const cards = (cardsResult.rows ?? []) as Array<{
		id: number
		front: string
		back: string
		created_at: string
	}>

	if (cards.length === 0) return []

	const labelsMap = await getLabelsForCards()

	return cards.map((c) => ({
		...c,
		labels: labelsMap.get(c.id) ?? [],
	}))
})
