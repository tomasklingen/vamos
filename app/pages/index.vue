<script setup lang="ts">
definePageMeta({ title: "Inicio" })

const players = [
	{
		name: "Player 1",
		emoji: "🦁",
		level: 4,
		xp: 340,
		xpMax: 500,
		streak: 7,
		color: "primary" as const,
	},
	{
		name: "Player 2",
		emoji: "🐯",
		level: 3,
		xp: 210,
		xpMax: 500,
		streak: 3,
		color: "secondary" as const,
	},
]

const todayChallenge = {
	phrase: "¿Cómo te llamas?",
	translation: "What is your name?",
}
</script>

<template>
	<UContainer class="py-10 space-y-10">
		<div class="text-center space-y-2">
			<p class="text-5xl">🌮</p>
			<h1 class="text-4xl font-bold tracking-tight">¡Bienvenidos!</h1>
			<p class="text-muted text-lg">Aprende español juntos 🇪🇸</p>
		</div>

		<!-- Player Cards -->
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
			<UCard v-for="player in players" :key="player.name">
				<template #header>
					<div class="flex items-center gap-3">
						<span class="text-4xl">{{ player.emoji }}</span>
						<div>
							<p class="font-bold text-lg">{{ player.name }}</p>
							<UBadge
								:label="`Nivel ${player.level}`"
								:color="player.color"
								variant="subtle"
								size="sm"
							/>
						</div>
					</div>
				</template>

				<div class="space-y-4">
					<div>
						<div class="flex justify-between text-sm mb-1.5">
							<span class="text-muted">XP</span>
							<span class="font-semibold">{{ player.xp }} / {{ player.xpMax }}</span>
						</div>
						<UProgress v-model="player.xp" :max="player.xpMax" :color="player.color" />
					</div>

					<div class="flex items-center gap-2 text-sm font-medium">
						<span class="text-xl">🔥</span>
						<span>{{ player.streak }}-day streak</span>
					</div>
				</div>

				<template #footer>
					<UButton to="/lesson" label="¡Empezar lección! 🚀" :color="player.color" block />
				</template>
			</UCard>
		</div>

		<!-- Today's Challenge -->
		<UCard class="border-2 border-dashed border-primary/40">
			<template #header>
				<div class="flex items-center gap-2 font-bold text-lg"><span>✨</span> Frase del día</div>
			</template>

			<div class="text-center py-6 space-y-3">
				<p class="text-3xl font-bold tracking-wide">{{ todayChallenge.phrase }}</p>
				<p class="text-muted italic text-lg">{{ todayChallenge.translation }}</p>
			</div>

			<template #footer>
				<UButton to="/lesson" label="Intentarlo 👉" variant="outline" block />
			</template>
		</UCard>
	</UContainer>
</template>
