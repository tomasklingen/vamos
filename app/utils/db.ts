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

class VamosDB extends Dexie {
	cardScheduling!: Table<CardScheduling, [string, ExerciseMode]>
	reviews!: Table<Review, number>

	constructor() {
		super("vamos")
		this.version(2).stores({
			cardScheduling: "[cardKey+mode]",
			reviews: "++id, [cardKey+mode]",
		})
	}
}

export const db = new VamosDB()
