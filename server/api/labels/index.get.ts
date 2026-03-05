export default defineEventHandler(async () => {
	const db = useDatabase()
	const result = await db.sql`SELECT name FROM labels ORDER BY name`
	return (result.rows ?? []).map((r) => (r as { name: string }).name)
})
