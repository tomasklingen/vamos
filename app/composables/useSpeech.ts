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

export function useSpeech() {
	async function speak(text: string, lang = "es-ES") {
		if (!import.meta.client || !window.speechSynthesis) return
		window.speechSynthesis.cancel()

		const utterance = new SpeechSynthesisUtterance(text)
		utterance.lang = lang
		utterance.rate = 0.85
		utterance.pitch = 1.1

		const voices = await getVoices()
		const preferred =
			voices.find((v) => v.lang === lang && /mónica|monica|lucía|lucia|female/i.test(v.name)) ??
			voices.find((v) => v.lang === lang)
		if (preferred) utterance.voice = preferred

		window.speechSynthesis.speak(utterance)
	}

	return { speak }
}
