<script setup lang="ts">
import type { ExerciseMode } from "~/utils/db"

const { t } = useI18n()

useHead(() => ({ title: t("nav.lesson") }))

const stateLabels = ["stateNew", "stateLearning", "stateReview", "stateRelearning"] as const
const stateColors = ["info", "warning", "success", "error"] as const

const route = useRoute()
const label = computed(() => route.query.label as string | undefined)
const mode = computed(() => (route.query.mode as ExerciseMode | undefined) ?? "forward")
const isBackward = computed(() => mode.value === "backward")

const { nextCard, dueCount, loading, submitReview } = useLesson(label, mode)
const revealed = ref(false)
const sessionCorrect = ref(0)
const sessionTotal = ref(0)

const { speak } = useSpeech()
const { autoPlay, voiceURI, rate } = useAudioSettings()

function speakSpanish() {
	if (!nextCard.value) return
	// In forward mode, front is Spanish. In backward mode, back (answer) is Spanish.
	const spanishText = isBackward.value ? nextCard.value.back : nextCard.value.front
	speak(spanishText, "es-ES", voiceURI.value, rate.value)
}

async function recordReview(rating: number) {
	if (!nextCard.value) return
	const { cardKey } = nextCard.value
	const isGood = rating >= 3
	revealed.value = false
	await submitReview(cardKey, rating)
	sessionTotal.value++
	if (isGood) sessionCorrect.value++
}

watch(nextCard, (c) => {
	if (c && autoPlay.value && !isBackward.value) {
		speakSpanish()
	}
})

function onKeydown(e: KeyboardEvent) {
	if (!nextCard.value) return

	if (e.key === "p" || e.key === "P") {
		speakSpanish()
		return
	}

	if (e.code === "Space" && !revealed.value) {
		e.preventDefault()
		revealed.value = true
		return
	}

	if (revealed.value) {
		const rating = Number(e.key)
		if (rating >= 1 && rating <= 4) {
			recordReview(rating)
		}
	}
}

onMounted(() => window.addEventListener("keydown", onKeydown))
onUnmounted(() => window.removeEventListener("keydown", onKeydown))
</script>

<template>
	<UContainer class="py-10 max-w-xl space-y-6">
		<div class="flex items-center justify-between">
			<h1 class="text-2xl font-bold flex items-center gap-2">
				<UIcon name="i-lucide-book-open" /> {{ t("lesson.heading")
				}}<template v-if="label"> · {{ label }}</template>
			</h1>
			<div class="flex items-center gap-4 text-sm text-muted">
				<div v-if="nextCard" class="flex items-center gap-1">
					<UIcon name="i-lucide-layers" />
					<span>{{ dueCount }}</span>
				</div>
				<div class="flex items-center gap-1">
					<UIcon name="i-lucide-check-circle" class="text-success" />
					<span>{{ sessionCorrect }} / {{ sessionTotal }}</span>
				</div>
			</div>
		</div>

		<!-- Loading state -->
		<UCard v-if="loading">
			<div class="text-center py-10">
				<UIcon name="i-lucide-loader-2" class="text-4xl text-muted mx-auto animate-spin" />
			</div>
		</UCard>

		<!-- Empty state -->
		<UCard v-else-if="!nextCard">
			<div class="text-center py-10 space-y-4">
				<UIcon name="i-lucide-party-popper" class="text-5xl text-success mx-auto" />
				<p class="text-xl font-bold">{{ t("lesson.allDone") }}</p>
				<p class="text-muted">{{ t("lesson.noMoreCards") }}</p>
				<UButton to="/" :label="t('nav.home')" icon="i-lucide-home" variant="outline" />
			</div>
		</UCard>

		<!-- Flashcard -->
		<template v-else>
			<UCard>
				<template #header>
					<div class="flex items-center justify-between">
						<p class="text-sm text-muted font-semibold uppercase tracking-widest">
							{{ isBackward ? t("lesson.translation") : t("lesson.spanish") }}
						</p>
						<div class="flex items-center gap-2 flex-wrap justify-end">
							<UBadge
								:label="t(`lesson.${stateLabels[nextCard.state] ?? 'stateNew'}`)"
								:color="stateColors[nextCard.state] ?? 'info'"
								variant="subtle"
								size="sm"
							/>
							<UBadge
								v-for="label in nextCard.labels"
								:key="label"
								:label="label"
								color="primary"
								variant="subtle"
								size="sm"
							/>
						</div>
					</div>
				</template>

				<div class="text-center py-10 space-y-6 min-h-48">
					<div class="flex items-center justify-center gap-3">
						<p class="text-3xl font-bold">{{ nextCard.front }}</p>
						<UTooltip v-if="!isBackward" :text="t('lesson.pronounce')" :kbds="['P']">
							<UButton
								icon="i-lucide-volume-2"
								color="neutral"
								variant="ghost"
								size="sm"
								:aria-label="t('lesson.pronounce')"
								@click="speakSpanish()"
							/>
						</UTooltip>
					</div>

					<Transition name="fade">
						<div v-if="revealed" class="space-y-2">
							<p class="text-muted text-sm uppercase tracking-widest">
								{{ isBackward ? t("lesson.spanish") : t("lesson.translation") }}
							</p>
							<div class="flex items-center justify-center gap-3">
								<p class="text-2xl font-semibold text-secondary">{{ nextCard.back }}</p>
								<UTooltip v-if="isBackward" :text="t('lesson.pronounce')" :kbds="['P']">
									<UButton
										icon="i-lucide-volume-2"
										color="neutral"
										variant="ghost"
										size="sm"
										:aria-label="t('lesson.pronounce')"
										@click="speakSpanish()"
									/>
								</UTooltip>
							</div>
						</div>
					</Transition>
				</div>

				<template #footer>
					<div v-if="!revealed">
						<UButton icon="i-lucide-eye" size="lg" variant="outline" block @click="revealed = true">
							{{ t("lesson.showAnswer") }}
							<UKbd value="space" class="hidden sm:inline-flex ms-2" />
						</UButton>
					</div>
					<div v-else class="space-y-1">
						<div class="grid grid-cols-4 gap-2 text-center text-xs text-muted">
							<span>{{ nextCard.intervals.again }}</span>
							<span>{{ nextCard.intervals.hard }}</span>
							<span>{{ nextCard.intervals.good }}</span>
							<span>{{ nextCard.intervals.easy }}</span>
						</div>
						<div class="grid grid-cols-4 gap-2">
							<UButton size="lg" color="error" block @click="recordReview(1)">
								{{ t("lesson.again") }}
								<UKbd value="1" class="hidden sm:inline-flex ms-1" />
							</UButton>
							<UButton size="lg" color="warning" block @click="recordReview(2)">
								{{ t("lesson.hard") }}
								<UKbd value="2" class="hidden sm:inline-flex ms-1" />
							</UButton>
							<UButton size="lg" color="success" block @click="recordReview(3)">
								{{ t("lesson.good") }}
								<UKbd value="3" class="hidden sm:inline-flex ms-1" />
							</UButton>
							<UButton size="lg" color="primary" block @click="recordReview(4)">
								{{ t("lesson.easy") }}
								<UKbd value="4" class="hidden sm:inline-flex ms-1" />
							</UButton>
						</div>
					</div>
				</template>
			</UCard>
		</template>
	</UContainer>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
