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

interface CardData {
	front: string
	back: string
	labels: string[]
}

interface LabelData {
	name: string
}

const cards: CardData[] = [
	...greetings.map(([front, back]) => ({ front, back, labels: ["greeting"] })),
	...goodbyes.map(([front, back]) => ({ front, back, labels: ["goodbye"] })),
	...numbers.map(([front, back]) => ({ front, back, labels: ["number"] })),
]

const labels: LabelData[] = [{ name: "greeting" }, { name: "goodbye" }, { name: "number" }]

const outDir = resolve(__dirname, "../public/data")
mkdirSync(outDir, { recursive: true })

writeFileSync(resolve(outDir, "cards.json"), JSON.stringify(cards, null, 2))
writeFileSync(resolve(outDir, "labels.json"), JSON.stringify(labels, null, 2))

console.log(`Generated ${cards.length} cards and ${labels.length} labels in public/data/`)
