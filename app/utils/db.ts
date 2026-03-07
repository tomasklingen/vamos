import Dexie, { type Table } from "dexie"
import type { State } from "ts-fsrs"

export type ExerciseMode = "forward" | "backward" | "production" | "dictation"

export interface CardScheduling {
	cardKey: string
	mode: ExerciseMode
	due: string
	stability: number
	difficulty: number
	elapsed_days: number
	scheduled_days: number
	learning_steps: number
	reps: number
	lapses: number
	state: State
	last_review: string | null
}

export interface Review {
	id?: number
	cardKey: string
	mode: ExerciseMode
	rating: number
	reviewed_at: string
}

// Schema migration rules:
// - Index-only changes: add a new version(), Dexie handles it automatically.
// - Primary key changes: set old table to null in an intermediate version,
//   then recreate in the next version. Data loss is acceptable for this app.
// - Never edit existing version() definitions — always add a new one.

class VamosDB extends Dexie {
	cardScheduling!: Table<CardScheduling, [string, ExerciseMode]>
	reviews!: Table<Review, number>

	constructor() {
		super("vamos")

		// v1: original schema — kept so Dexie knows what it's upgrading FROM
		this.version(1).stores({
			cardScheduling: "cardId",
			reviews: "++id, cardId",
		})

		// v2: drop both tables — required intermediate step because IndexedDB
		// cannot change a primary key in-place (v1 used cardId, v3 uses [cardKey+mode])
		this.version(2).stores({
			cardScheduling: null,
			reviews: null,
		})

		// v3: current schema
		this.version(3).stores({
			cardScheduling: "[cardKey+mode]",
			reviews: "++id, [cardKey+mode]",
		})
	}
}

export const db = new VamosDB()

db.open().catch(async (err: unknown) => {
	console.warn("[vamos] DB open failed, resetting local data:", err)
	await Dexie.delete("vamos")
	window.location.reload()
})
