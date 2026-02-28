<script setup lang="ts">
const { t } = useI18n()

useHead(() => ({ title: t("nav.lesson") }))

interface Card {
	id: number
	front: string
	back: string
	category: string
}

const { data: card, refresh } = await useFetch<Card | null>("/api/cards/next")
const revealed = ref(false)
const sessionCorrect = ref(0)
const sessionTotal = ref(0)

async function recordReview(correct: boolean) {
	if (!card.value) return
	await $fetch("/api/reviews", {
		method: "POST",
		body: { cardId: card.value.id, correct },
	})
	sessionTotal.value++
	if (correct) sessionCorrect.value++
	revealed.value = false
	await refresh()
}

const { speak } = useSpeech()
</script>

<template>
	<UContainer class="py-10 max-w-xl space-y-6">
		<div class="flex items-center justify-between">
			<h1 class="text-2xl font-bold flex items-center gap-2">
				<UIcon name="i-lucide-book-open" /> {{ t("lesson.heading") }}
			</h1>
			<div class="flex items-center gap-2 text-sm text-muted">
				<UIcon name="i-lucide-check-circle" class="text-success" />
				<span>{{ sessionCorrect }} / {{ sessionTotal }}</span>
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
						<UBadge :label="card.category" color="primary" variant="subtle" size="sm" />
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
						<UButton
							:label="t('lesson.showAnswer')"
							icon="i-lucide-eye"
							size="lg"
							variant="outline"
							block
							@click="revealed = true"
						/>
					</div>
					<div v-else class="grid grid-cols-2 gap-3">
						<UButton
							:label="t('lesson.knew')"
							icon="i-lucide-check"
							size="lg"
							color="success"
							block
							@click="recordReview(true)"
						/>
						<UButton
							:label="t('lesson.didntKnow')"
							icon="i-lucide-x"
							size="lg"
							color="error"
							block
							@click="recordReview(false)"
						/>
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
