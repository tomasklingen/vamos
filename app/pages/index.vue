<script setup lang="ts">
definePageMeta({ title: "Inicio" })

const { data: stats } = await useFetch("/api/stats")
const { data: nextCard } = await useFetch("/api/cards/next")
</script>

<template>
	<UContainer class="py-10 space-y-10">
		<div class="text-center space-y-2">
			<p class="text-5xl">🇪🇸</p>
			<h1 class="text-4xl font-bold tracking-tight">¡Vamos!</h1>
			<p class="text-muted text-lg">Tu entrenador de español personal</p>
		</div>

		<!-- Stats -->
		<div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
			<UCard class="text-center">
				<p class="text-3xl font-bold text-primary">{{ stats?.totalCards ?? 0 }}</p>
				<p class="text-sm text-muted mt-1">Tarjetas</p>
			</UCard>
			<UCard class="text-center">
				<p class="text-3xl font-bold text-secondary">{{ stats?.totalReviews ?? 0 }}</p>
				<p class="text-sm text-muted mt-1">Repasos</p>
			</UCard>
			<UCard class="text-center">
				<p class="text-3xl font-bold text-success">{{ stats?.accuracy ?? 0 }}%</p>
				<p class="text-sm text-muted mt-1">Precisión</p>
			</UCard>
			<UCard class="text-center">
				<p class="text-3xl font-bold text-warning">🔥 {{ stats?.streak ?? 0 }}</p>
				<p class="text-sm text-muted mt-1">Racha días</p>
			</UCard>
		</div>

		<!-- Start practice -->
		<UButton to="/lesson" label="¡Empezar a practicar! 🚀" size="xl" block />

		<!-- Next card preview -->
		<UCard v-if="nextCard" class="border-2 border-dashed border-primary/40">
			<template #header>
				<div class="flex items-center gap-2 font-bold text-lg">
					<span>✨</span> Próxima tarjeta
				</div>
			</template>
			<div class="text-center py-6 space-y-3">
				<p class="text-3xl font-bold">{{ nextCard.front }}</p>
				<UBadge :label="String(nextCard.category)" color="primary" variant="subtle" />
			</div>
			<template #footer>
				<UButton to="/lesson" label="Practicar ahora 👉" variant="outline" block />
			</template>
		</UCard>

		<UCard v-else>
			<div class="text-center py-6 space-y-3">
				<p class="text-4xl">📭</p>
				<p class="text-muted">No hay tarjetas todavía.</p>
				<UButton to="/cards" label="Añadir tarjetas" variant="outline" />
			</div>
		</UCard>
	</UContainer>
</template>
