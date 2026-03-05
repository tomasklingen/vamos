import Dexie, { type Table } from "dexie"
import type { State } from "ts-fsrs"

export interface CardScheduling {
	cardId: number
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
	cardId: number
	rating: number
	reviewed_at: string
}

class VamosDB extends Dexie {
	cardScheduling!: Table<CardScheduling, number>
	reviews!: Table<Review, number>

	constructor() {
		super("vamos")
		this.version(1).stores({
			cardScheduling: "cardId",
			reviews: "++id, cardId",
		})
	}
}

export const db = new VamosDB()
