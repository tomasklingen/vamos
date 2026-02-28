export async function ensureTables() {
	const db = useDatabase()

	await db.sql`CREATE TABLE IF NOT EXISTS cards (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		front TEXT NOT NULL,
		back TEXT NOT NULL,
		category TEXT NOT NULL DEFAULT 'custom',
		created_at TEXT NOT NULL DEFAULT (datetime('now')),
		due TEXT NOT NULL DEFAULT (datetime('now')),
		stability REAL NOT NULL DEFAULT 0,
		difficulty REAL NOT NULL DEFAULT 0,
		elapsed_days INTEGER NOT NULL DEFAULT 0,
		scheduled_days INTEGER NOT NULL DEFAULT 0,
		learning_steps INTEGER NOT NULL DEFAULT 0,
		reps INTEGER NOT NULL DEFAULT 0,
		lapses INTEGER NOT NULL DEFAULT 0,
		state INTEGER NOT NULL DEFAULT 0,
		last_review TEXT,
		UNIQUE(front, category)
	)`

	await db.sql`CREATE TABLE IF NOT EXISTS reviews (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		card_id INTEGER NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
		rating INTEGER NOT NULL,
		reviewed_at TEXT NOT NULL DEFAULT (datetime('now'))
	)`

	return db
}
