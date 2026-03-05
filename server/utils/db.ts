export async function getLabelsForCards(): Promise<Map<number, string[]>> {
	const db = useDatabase()
	const result = await db.sql`
		SELECT cl.card_id, l.name
		FROM card_labels cl
		JOIN labels l ON l.id = cl.label_id
		ORDER BY cl.card_id, l.name
	`
	const map = new Map<number, string[]>()
	for (const row of result.rows ?? []) {
		const r = row as { card_id: number; name: string }
		const labels = map.get(r.card_id) ?? []
		labels.push(r.name)
		map.set(r.card_id, labels)
	}
	return map
}
