export async function ensureTables() {
	const db = useDatabase()

	await db.sql`CREATE TABLE IF NOT EXISTS cards (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		front TEXT NOT NULL,
		back TEXT NOT NULL,
		category TEXT NOT NULL DEFAULT 'custom',
		created_at TEXT NOT NULL DEFAULT (datetime('now')),
		UNIQUE(front, category)
	)`

	await db.sql`CREATE TABLE IF NOT EXISTS reviews (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		card_id INTEGER NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
		correct INTEGER NOT NULL DEFAULT 0,
		reviewed_at TEXT NOT NULL DEFAULT (datetime('now'))
	)`

	return db
}
