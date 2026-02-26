import Database from "better-sqlite3"
import { mkdirSync } from "node:fs"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataDir = resolve(__dirname, "../.data")
mkdirSync(dataDir, { recursive: true })

const db = new Database(resolve(dataDir, "db.sqlite"))
db.pragma("journal_mode = WAL")
db.pragma("foreign_keys = ON")

db.exec(`CREATE TABLE IF NOT EXISTS cards (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	front TEXT NOT NULL,
	back TEXT NOT NULL,
	category TEXT NOT NULL DEFAULT 'custom',
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	UNIQUE(front, category)
)`)

db.exec(`CREATE TABLE IF NOT EXISTS reviews (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	card_id INTEGER NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
	correct INTEGER NOT NULL DEFAULT 0,
	reviewed_at TEXT NOT NULL DEFAULT (datetime('now'))
)`)

const insert = db.prepare("INSERT OR IGNORE INTO cards (front, back, category) VALUES (?, ?, ?)")

type Card = [string, string]

const greetings: Card[] = [
	["Hola", "Hello"],
	["Buenos días", "Good morning"],
	["Buenas tardes", "Good afternoon"],
	["Buenas noches", "Good evening / Good night"],
	["¿Cómo estás?", "How are you?"],
	["¿Qué tal?", "What's up? / How's it going?"],
	["Mucho gusto", "Nice to meet you"],
	["Bienvenido", "Welcome"],
	["¿Cómo te llamas?", "What is your name?"],
	["Me llamo...", "My name is..."],
	["Encantado", "Pleased to meet you"],
	["¿De dónde eres?", "Where are you from?"],
]

const goodbyes: Card[] = [
	["Adiós", "Goodbye"],
	["Hasta luego", "See you later"],
	["Hasta mañana", "See you tomorrow"],
	["Nos vemos", "See you"],
	["Chao", "Bye"],
	["Hasta pronto", "See you soon"],
	["Cuídate", "Take care"],
	["Que te vaya bien", "Have a good one"],
]

const ones = ["", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve",
	"diez", "once", "doce", "trece", "catorce", "quince"]
const teens = ["dieciséis", "diecisiete", "dieciocho", "diecinueve"]
const tens = ["", "", "veinte", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"]

function toSpanish(n: number): string {
	if (n <= 15) return ones[n] ?? ""
	if (n <= 19) return teens[n - 16] ?? ""
	if (n === 20) return "veinte"
	if (n <= 29) return `veinti${ones[n - 20]}`
	if (n === 100) return "cien"
	const ten = Math.floor(n / 10)
	const one = n % 10
	return one === 0 ? (tens[ten] ?? "") : `${tens[ten]} y ${ones[one]}`
}

const numbers: Card[] = Array.from({ length: 100 }, (_, i) => {
	const n = i + 1
	return [toSpanish(n), String(n)] as Card
})

const insertMany = db.transaction((cards: Card[], category: string) => {
	for (const [front, back] of cards) {
		insert.run(front, back, category)
	}
})

insertMany(greetings, "greeting")
insertMany(goodbyes, "goodbye")
insertMany(numbers, "number")

db.close()

const total = greetings.length + goodbyes.length + numbers.length
console.log(`✅ Seed complete — ${total} cards inserted (duplicates skipped)`)
