<script setup lang="ts">
definePageMeta({ title: "Lección" })

const question = {
	prompt: "How do you say 'apple' in Spanish?",
	choices: ["manzana", "naranja", "pera", "uva"],
	correct: "manzana",
}

const selected = ref<string | null>(null)
const submitted = ref(false)
const streak = ref(5)

const isCorrect = computed(() => selected.value === question.correct)
const alertDescription = computed(() =>
	isCorrect.value ? "¡Sigue así!" : `The correct answer is "${question.correct}".`,
)

function submit() {
	if (!selected.value) return
	submitted.value = true
	if (isCorrect.value) streak.value++
}

function next() {
	selected.value = null
	submitted.value = false
}
</script>

<template>
	<UContainer class="py-10 max-w-xl space-y-6">
		<div class="flex items-center justify-between">
			<h1 class="text-2xl font-bold">📖 Lección</h1>
			<div class="flex items-center gap-1.5">
				<span class="text-xl">🔥</span>
				<UBadge :label="`${streak} días`" color="warning" variant="subtle" size="lg" />
			</div>
		</div>

		<UCard>
			<template #header>
				<p class="text-sm text-muted font-semibold uppercase tracking-widest">🇪🇸 Traduce</p>
			</template>

			<p class="text-2xl font-bold text-center py-6">{{ question.prompt }}</p>

			<div class="grid grid-cols-2 gap-3">
				<UButton
					v-for="choice in question.choices"
					:key="choice"
					:label="choice"
					size="lg"
					:color="
						submitted
							? choice === question.correct
								? 'success'
								: choice === selected
									? 'error'
									: 'neutral'
							: selected === choice
								? 'primary'
								: 'neutral'
					"
					:variant="selected === choice || submitted ? 'solid' : 'outline'"
					:disabled="submitted"
					block
					@click="selected = choice"
				/>
			</div>

			<template #footer>
				<div v-if="!submitted">
					<UButton label="Comprobar ✔" size="lg" :disabled="!selected" block @click="submit" />
				</div>
				<div v-else class="space-y-3">
					<UAlert
						:color="isCorrect ? 'success' : 'error'"
						:icon="isCorrect ? 'i-lucide-check-circle' : 'i-lucide-x-circle'"
						:title="isCorrect ? '¡Correcto! 🎉' : '¡Casi! 😅'"
						:description="alertDescription"
					/>
					<UButton label="Siguiente pregunta →" size="lg" block @click="next" />
				</div>
			</template>
		</UCard>
	</UContainer>
</template>
