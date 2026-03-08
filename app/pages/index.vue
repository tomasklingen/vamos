<script setup lang="ts">
import type { ExerciseMode } from "~/utils/db"

const { t } = useI18n()

useHead(() => ({ title: t("nav.home") }))

const { totalCards, totalReviews, accuracy, streak } = useStats()

const { data: allLabels } = useLabels()
const selectedLabel = ref<string | undefined>(undefined)

const { progress } = useModeProgress(selectedLabel)

interface ModeRow {
	mode: ExerciseMode
	nameKey: string
	descKey: string
	icon: string
	enabled: boolean
}

const modeRows: ModeRow[] = [
	{
		mode: "forward",
		nameKey: "home.recognition",
		descKey: "home.recognitionDesc",
		icon: "i-lucide-eye",
		enabled: true,
	},
	{
		mode: "backward",
		nameKey: "home.activeRecall",
		descKey: "home.activeRecallDesc",
		icon: "i-lucide-brain",
		enabled: true,
	},
	{
		mode: "production",
		nameKey: "home.production",
		descKey: "home.productionDesc",
		icon: "i-lucide-pencil",
		enabled: false,
	},
	{
		mode: "dictation",
		nameKey: "home.dictation",
		descKey: "home.dictationDesc",
		icon: "i-lucide-headphones",
		enabled: false,
	},
]

function lessonUrl(mode: ExerciseMode) {
	const params = new URLSearchParams()
	params.set("mode", mode)
	if (selectedLabel.value) params.set("label", selectedLabel.value)
	return `/lesson?${params.toString()}`
}

function selectLabel(name: string | undefined) {
	selectedLabel.value = selectedLabel.value === name ? undefined : name
}
</script>

<template>
	<UContainer class="max-w-xl py-10 space-y-10">
		<div class="text-center space-y-2">
			<h1 class="text-4xl font-bold tracking-tight">{{ t("home.heading") }}</h1>
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

		<!-- Content Set Selector -->
		<div class="flex flex-wrap gap-2">
			<UButton
				:variant="selectedLabel === undefined ? 'solid' : 'outline'"
				color="primary"
				size="sm"
				@click="selectLabel(undefined)"
			>
				{{ t("home.mix") }}
			</UButton>
			<UButton
				v-for="l in allLabels"
				:key="l.name"
				:variant="selectedLabel === l.name ? 'solid' : 'outline'"
				color="primary"
				size="sm"
				@click="selectLabel(l.name)"
			>
				{{ l.name }}
			</UButton>
		</div>

		<!-- Skill Rings / Progress -->
		<UCard>
			<template #header>
				<h2 class="text-lg font-bold">{{ t("home.progress") }}</h2>
			</template>

			<div class="divide-y divide-default">
				<template v-for="row in modeRows" :key="row.mode">
					<NuxtLink
						v-if="row.enabled"
						:to="lessonUrl(row.mode)"
						class="flex items-start gap-4 py-3 px-1 -mx-1 rounded-lg hover:bg-elevated transition-colors cursor-pointer"
					>
						<UIcon :name="row.icon" class="text-xl text-primary shrink-0 mt-0.5" />
						<div class="flex-1 min-w-0 space-y-1.5">
							<div class="flex items-center gap-2 flex-wrap">
								<p class="font-semibold text-sm">{{ t(row.nameKey) }}</p>
								<UBadge
									v-if="progress[row.mode].dueCount > 0"
									:label="t('home.cardsDueMode', { n: progress[row.mode].dueCount })"
									color="primary"
									variant="subtle"
									size="sm"
								/>
							</div>
							<p class="text-xs text-muted">{{ t(row.descKey) }}</p>
							<div class="flex items-center gap-2">
								<div class="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
									<div
										class="h-full bg-primary rounded-full"
										:style="{ width: `${progress[row.mode].percentage}%` }"
									/>
								</div>
								<span class="text-xs font-mono text-muted w-8 text-right"
									>{{ progress[row.mode].percentage }}%</span
								>
							</div>
						</div>
					</NuxtLink>

					<div v-else class="flex items-center gap-4 py-3 px-1 opacity-50 cursor-not-allowed">
						<UIcon :name="row.icon" class="text-xl text-muted shrink-0" />
						<div class="flex-1 min-w-0">
							<p class="font-semibold text-sm text-muted">{{ t(row.nameKey) }}</p>
							<p class="text-xs text-muted truncate">{{ t(row.descKey) }}</p>
						</div>
						<UBadge :label="t('home.comingSoon')" color="neutral" variant="subtle" size="sm" />
					</div>
				</template>
			</div>
		</UCard>
	</UContainer>
</template>
