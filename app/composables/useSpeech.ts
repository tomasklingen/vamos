const KNOWN_FEMALE =
	/mónica|monica|paulina|lucía|lucia|lola|marisol|elena|isabela|grandma|female|femenin/i

export interface SpanishVoice {
	uri: string
	name: string
	lang: string
}

function getVoices(): Promise<SpeechSynthesisVoice[]> {
	const voices = window.speechSynthesis.getVoices()
	if (voices.length > 0) return Promise.resolve(voices)

	const { promise, resolve } = Promise.withResolvers<SpeechSynthesisVoice[]>()
	window.speechSynthesis.addEventListener(
		"voiceschanged",
		() => {
			resolve(window.speechSynthesis.getVoices())
		},
		{ once: true },
	)

	return promise
}

const spanishVoices = ref<SpanishVoice[]>([])
let voicesLoaded = false

async function loadSpanishVoices() {
	if (voicesLoaded || !import.meta.client) return
	const all = await getVoices()
	spanishVoices.value = all
		.filter((v) => v.lang.startsWith("es"))
		.map((v) => ({
			uri: v.voiceURI,
			name: v.name,
			lang: v.lang,
		}))
	voicesLoaded = true
}

export function useSpeech() {
	if (import.meta.client) {
		loadSpanishVoices()
	}

	async function speak(text: string, lang = "es-ES", preferredURI?: string | null, rate = 0.85) {
		if (!import.meta.client || !window.speechSynthesis) return
		window.speechSynthesis.cancel()

		const utterance = new SpeechSynthesisUtterance(text)
		utterance.lang = lang
		utterance.rate = rate
		utterance.pitch = 1.1

		const voices = await getVoices()

		let voice: SpeechSynthesisVoice | undefined
		if (preferredURI) {
			voice = voices.find((v) => v.voiceURI === preferredURI)
		}
		if (!voice) {
			voice =
				voices.find((v) => v.lang.startsWith("es") && KNOWN_FEMALE.test(v.name)) ??
				voices.find((v) => v.lang.startsWith("es"))
		}
		if (voice) utterance.voice = voice

		window.speechSynthesis.speak(utterance)
	}

	return { speak, spanishVoices: readonly(spanishVoices) }
}
