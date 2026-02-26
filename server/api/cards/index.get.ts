export default defineEventHandler(async (event) => {
	const query = getQuery(event)
	const category = typeof query.category === "string" ? query.category : undefined
	const db = useDatabase()

	if (category) {
		const result =
			await db.sql`SELECT * FROM cards WHERE category = ${category} ORDER BY created_at DESC`
		return result.rows
	}

	const result = await db.sql`SELECT * FROM cards ORDER BY created_at DESC`
	return result.rows
})
