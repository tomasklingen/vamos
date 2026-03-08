import { mkdirSync, writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))

type Card = [string, string]

const greetingsEn: Card[] = [
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

const greetingsNl: Card[] = [
	["Hola", "Hallo"],
	["Buenos días", "Goedemorgen"],
	["Buenas tardes", "Goedemiddag"],
	["Buenas noches", "Goedenavond / Goedenacht"],
	["¿Cómo estás?", "Hoe gaat het?"],
	["¿Qué tal?", "Hoe is het?"],
	["Mucho gusto", "Aangenaam kennis te maken"],
	["Bienvenido", "Welkom"],
	["¿Cómo te llamas?", "Hoe heet je?"],
	["Me llamo...", "Mijn naam is..."],
	["Encantado", "Aangenaam"],
	["¿De dónde eres?", "Waar kom je vandaan?"],
]

const goodbyesEn: Card[] = [
	["Adiós", "Goodbye"],
	["Hasta luego", "See you later"],
	["Hasta mañana", "See you tomorrow"],
	["Nos vemos", "See you"],
	["Chao", "Bye"],
	["Hasta pronto", "See you soon"],
	["Cuídate", "Take care"],
	["Que te vaya bien", "Have a good one"],
]

const goodbyesNl: Card[] = [
	["Adiós", "Tot ziens"],
	["Hasta luego", "Tot later"],
	["Hasta mañana", "Tot morgen"],
	["Nos vemos", "Tot zo"],
	["Chao", "Doei"],
	["Hasta pronto", "Tot snel"],
	["Cuídate", "Pas goed op jezelf"],
	["Que te vaya bien", "Veel succes"],
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

const numbersCards: Card[] = Array.from({ length: 100 }, (_, i) => {
	const n = i + 1
	return [toSpanish(n), String(n)] as Card
})

interface CardData {
	front: string
	back: string
	labels: string[]
}

const locales: Record<string, Record<string, CardData[]>> = {
	en: {
		"greetings.json": greetingsEn.map(([front, back]) => ({ front, back, labels: ["greeting"] })),
		"goodbyes.json": goodbyesEn.map(([front, back]) => ({ front, back, labels: ["goodbye"] })),
		"numbers.json": numbersCards.map(([front, back]) => ({ front, back, labels: ["number"] })),
	},
	nl: {
		"greetings.json": greetingsNl.map(([front, back]) => ({ front, back, labels: ["greeting"] })),
		"goodbyes.json": goodbyesNl.map(([front, back]) => ({ front, back, labels: ["goodbye"] })),
		"numbers.json": numbersCards.map(([front, back]) => ({ front, back, labels: ["number"] })),
	},
}

let totalCards = 0
let totalFiles = 0

for (const [locale, datasets] of Object.entries(locales)) {
	const outDir = resolve(__dirname, `../public/data/${locale}`)
	mkdirSync(outDir, { recursive: true })
	for (const [filename, cards] of Object.entries(datasets)) {
		writeFileSync(resolve(outDir, filename), JSON.stringify(cards, null, 2))
		totalCards += cards.length
		totalFiles++
	}
}

console.log(
	`Generated ${totalCards} cards across ${totalFiles} files in public/data/{${Object.keys(locales).join(",")}}`,
)
