<script setup lang="ts">
const { t } = useI18n()

useHead(() => ({ title: t("nav.lesson") }))

interface CardResponse {
	id: number
	front: string
	back: string
	category: string
	state: number
	intervals: { again: string; hard: string; good: string; easy: string }
	dueCount: number
}

const stateLabels = ["stateNew", "stateLearning", "stateReview", "stateRelearning"] as const
const stateColors = ["info", "warning", "success", "error"] as const

const { data: card, refresh } = await useFetch<CardResponse | null>("/api/cards/next")
const revealed = ref(false)
const sessionCorrect = ref(0)
const sessionTotal = ref(0)

async function recordReview(rating: number) {
	if (!card.value) return
	await $fetch("/api/reviews", {
		method: "POST",
		body: { cardId: card.value.id, rating },
	})
	sessionTotal.value++
	if (rating >= 3) sessionCorrect.value++
	revealed.value = false
	await refresh()
}

const { speak } = useSpeech()

function onKeydown(e: KeyboardEvent) {
	if (!card.value) return

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
				<UIcon name="i-lucide-book-open" /> {{ t("lesson.heading") }}
			</h1>
			<div class="flex items-center gap-4 text-sm text-muted">
				<div v-if="card" class="flex items-center gap-1">
					<UIcon name="i-lucide-layers" />
					<span>{{ card.dueCount }}</span>
				</div>
				<div class="flex items-center gap-1">
					<UIcon name="i-lucide-check-circle" class="text-success" />
					<span>{{ sessionCorrect }} / {{ sessionTotal }}</span>
				</div>
			</div>
		</div>

		<!-- Empty state -->
		<UCard v-if="!card">
			<div class="text-center py-10 space-y-4">
				<UIcon name="i-lucide-party-popper" class="text-5xl text-success mx-auto" />
				<p class="text-xl font-bold">{{ t("lesson.allDone") }}</p>
				<p class="text-muted">{{ t("lesson.noMoreCards") }}</p>
				<UButton to="/cards" :label="t('lesson.addMoreCards')" icon="i-lucide-plus" />
			</div>
		</UCard>

		<!-- Flashcard -->
		<template v-else>
			<UCard>
				<template #header>
					<div class="flex items-center justify-between">
						<p class="text-sm text-muted font-semibold uppercase tracking-widest">
							{{ t("lesson.spanish") }}
						</p>
						<div class="flex items-center gap-2">
							<UBadge
								:label="t(`lesson.${stateLabels[card.state]}`)"
								:color="stateColors[card.state]"
								variant="subtle"
								size="sm"
							/>
							<UBadge :label="card.category" color="primary" variant="subtle" size="sm" />
						</div>
					</div>
				</template>

				<div class="text-center py-10 space-y-6 min-h-48">
					<div class="flex items-center justify-center gap-3">
						<p class="text-3xl font-bold">{{ card.front }}</p>
						<UButton
							icon="i-lucide-volume-2"
							color="neutral"
							variant="ghost"
							size="sm"
							:aria-label="t('lesson.pronounce')"
							@click="speak(card.front)"
						/>
					</div>

					<Transition name="fade">
						<div v-if="revealed" class="space-y-2">
							<p class="text-muted text-sm uppercase tracking-widest">
								{{ t("lesson.translation") }}
							</p>
							<p class="text-2xl font-semibold text-secondary">{{ card.back }}</p>
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
							<span>{{ card.intervals.again }}</span>
							<span>{{ card.intervals.hard }}</span>
							<span>{{ card.intervals.good }}</span>
							<span>{{ card.intervals.easy }}</span>
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
