const STORAGE_KEY = "vamos-audio-settings"

interface AudioSettings {
	autoPlay: boolean
	voiceURI: string | null
	rate: number
}

const defaults: AudioSettings = {
	autoPlay: false,
	voiceURI: null,
	rate: 0.85,
}

function load(): AudioSettings {
	if (!import.meta.client) return { ...defaults }
	try {
		const raw = localStorage.getItem(STORAGE_KEY)
		if (!raw) return { ...defaults }
		return { ...defaults, ...JSON.parse(raw) }
	} catch {
		return { ...defaults }
	}
}

function save(settings: AudioSettings) {
	if (!import.meta.client) return
	localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
}

const autoPlay = ref(false)
const voiceURI = ref<string | null>(null)
const rate = ref(0.85)

let initialized = false

export function useAudioSettings() {
	if (!initialized && import.meta.client) {
		const stored = load()
		autoPlay.value = stored.autoPlay
		voiceURI.value = stored.voiceURI
		rate.value = stored.rate
		initialized = true
	}

	function persist() {
		save({ autoPlay: autoPlay.value, voiceURI: voiceURI.value, rate: rate.value })
	}

	function setAutoPlay(value: boolean) {
		autoPlay.value = value
		persist()
	}

	function setVoiceURI(uri: string | null) {
		voiceURI.value = uri
		persist()
	}

	function setRate(value: number) {
		rate.value = value
		persist()
	}

	return {
		autoPlay: readonly(autoPlay),
		voiceURI: readonly(voiceURI),
		rate: readonly(rate),
		setAutoPlay,
		setVoiceURI,
		setRate,
	}
}
