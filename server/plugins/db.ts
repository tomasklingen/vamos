export default defineNitroPlugin(async () => {
	const db = useDatabase()
	await db.sql`PRAGMA foreign_keys = ON`
	await ensureTables()
})
