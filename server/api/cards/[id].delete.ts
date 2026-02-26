export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, "id")
	const db = useDatabase()

	await db.sql`DELETE FROM cards WHERE id = ${id}`

	return { ok: true }
})
