import { execSync } from "node:child_process"
import { mkdirSync, writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))

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

const ones = [
	"",
	"uno",
	"dos",
	"tres",
	"cuatro",
	"cinco",
	"seis",
	"siete",
	"ocho",
	"nueve",
	"diez",
	"once",
	"doce",
	"trece",
	"catorce",
	"quince",
]
const teens = ["dieciséis", "diecisiete", "dieciocho", "diecinueve"]
const tens = [
	"",
	"",
	"veinte",
	"treinta",
	"cuarenta",
	"cincuenta",
	"sesenta",
	"setenta",
	"ochenta",
	"noventa",
]

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

function esc(s: string): string {
	return s.replace(/'/g, "''")
}

function cardInserts(cards: Card[], label: string): string {
	return cards
		.map(
			([
				front,
				back,
			]) => `INSERT OR IGNORE INTO cards (front, back) VALUES ('${esc(front)}', '${esc(back)}');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = '${esc(front)}' AND c.back = '${esc(back)}' AND l.name = '${label}';`,
		)
		.join("\n")
}

const sql = `-- Auto-generated seed file — do not edit manually
CREATE TABLE IF NOT EXISTS cards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(front, back)
);

CREATE TABLE IF NOT EXISTS labels (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS card_labels (
  card_id INTEGER NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  label_id INTEGER NOT NULL REFERENCES labels(id) ON DELETE CASCADE,
  PRIMARY KEY(card_id, label_id)
);

INSERT OR IGNORE INTO labels (name) VALUES ('greeting'), ('goodbye'), ('number');

${cardInserts(greetings, "greeting")}

${cardInserts(goodbyes, "goodbye")}

${cardInserts(numbers, "number")}
`

const sqlPath = resolve(__dirname, "seed.sql")
mkdirSync(dirname(sqlPath), { recursive: true })
writeFileSync(sqlPath, sql)

const isRemote = process.argv.includes("--remote")
const flag = isRemote ? "--remote" : "--local"
execSync(`wrangler d1 execute vamos ${flag} --file="${sqlPath}"`, { stdio: "inherit" })

const total = greetings.length + goodbyes.length + numbers.length
console.log(`✅ Seed complete — ${total} cards seeded (${isRemote ? "remote" : "local"})`)
