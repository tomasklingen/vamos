<script setup lang="ts">
const { t } = useI18n()

useHead(() => ({ title: t("nav.home") }))

const { totalCards, totalReviews, accuracy, streak } = useStats()
const { nextCard, dueCount } = useLesson()
</script>

<template>
	<UContainer class="max-w-xl py-10 space-y-10">
		<div class="text-center space-y-2">
			<h1 class="text-4xl font-bold tracking-tight">{{ t("home.heading") }}</h1>
			<p class="text-muted text-lg">{{ t("home.subheading") }}</p>
		</div>

		<!-- Stats -->
		<div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
			<UCard class="text-center">
				<p class="text-3xl font-bold text-primary">{{ totalCards }}</p>
				<p class="text-sm text-muted mt-1 break-words">{{ t("home.stats.cards") }}</p>
			</UCard>
			<UCard class="text-center">
				<p class="text-3xl font-bold text-secondary">{{ totalReviews }}</p>
				<p class="text-sm text-muted mt-1 break-words">{{ t("home.stats.reviews") }}</p>
			</UCard>
			<UCard class="text-center">
				<p class="text-3xl font-bold text-success">{{ accuracy }}%</p>
				<p class="text-sm text-muted mt-1 break-words">{{ t("home.stats.accuracy") }}</p>
			</UCard>
			<UCard class="text-center">
				<div class="flex items-center justify-center gap-1">
					<UIcon name="i-lucide-flame" class="text-warning text-2xl" />
					<p class="text-3xl font-bold text-warning">{{ streak }}</p>
				</div>
				<p class="text-sm text-muted mt-1 break-words">{{ t("home.stats.streak") }}</p>
			</UCard>
		</div>

		<!-- Start practice -->
		<div class="space-y-2">
			<UButton to="/lesson" :label="t('home.startPractice')" icon="i-lucide-play" size="xl" block />
			<p v-if="dueCount > 0" class="text-center text-sm text-muted">
				{{ dueCount }} {{ t("home.cardsDue") }}
			</p>
		</div>

		<!-- Next card preview -->
		<UCard v-if="nextCard" class="border-2 border-dashed border-primary/40">
			<template #header>
				<div class="flex items-center gap-2 font-bold text-lg">
					<UIcon name="i-lucide-sparkles" /> {{ t("home.nextCard") }}
				</div>
			</template>
			<div class="text-center py-6 space-y-3">
				<p class="text-3xl font-bold">{{ nextCard.front }}</p>
				<div class="flex gap-1 justify-center flex-wrap">
					<UBadge
						v-for="label in nextCard.labels"
						:key="label"
						:label="label"
						color="primary"
						variant="subtle"
					/>
				</div>
			</div>
			<template #footer>
				<UButton
					to="/lesson"
					:label="t('home.practiceNow')"
					icon="i-lucide-arrow-right"
					trailing-icon="i-lucide-arrow-right"
					variant="outline"
					block
				/>
			</template>
		</UCard>

		<UCard v-else>
			<div class="text-center py-6 space-y-3">
				<UIcon name="i-lucide-inbox" class="text-4xl text-muted mx-auto" />
				<p class="text-muted">{{ t("home.noCards") }}</p>
			</div>
		</UCard>
	</UContainer>
</template>
