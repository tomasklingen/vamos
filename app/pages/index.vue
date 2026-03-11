<script setup lang="ts">
import type { ExerciseMode } from "~/utils/db"

const { t } = useI18n()

useHead(() => ({ title: t("home.siteTitle"), titleTemplate: null }))

const { totalCards, totalReviews, accuracy, streak } = useStats()

const { data: lessons } = useLessons()
const selectedLabel = ref<string | undefined>(undefined)
const expandedLessons = ref<Set<string>>(new Set())

const labelFilter = computed<string | string[] | undefined>(() => {
	if (!selectedLabel.value) return undefined
	const lesson = lessons.value.find((l) => l.id === selectedLabel.value)
	if (lesson) return lesson.subjects
	return selectedLabel.value
})

const { progress } = useModeProgress(labelFilter)

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

function toggleLesson(id: string) {
	if (expandedLessons.value.has(id)) {
		expandedLessons.value.delete(id)
	} else {
		expandedLessons.value.add(id)
	}
	// Trigger reactivity
	expandedLessons.value = new Set(expandedLessons.value)
}

function isLessonActive(lesson: { id: string; subjects: string[] }) {
	return selectedLabel.value === lesson.id || lesson.subjects.includes(selectedLabel.value ?? "")
}
</script>

<template>
	<UContainer class="max-w-xl py-10 space-y-10">
		<div class="text-center space-y-2">
			<h1 class="text-4xl font-bold tracking-tight">{{ t("home.heading") }}</h1>
		</div>

		<!-- Stats -->
		<div class="grid grid-cols-4 gap-2">
			<UCard class="text-center">
				<p class="text-xl font-bold text-primary">{{ totalCards }}</p>
				<p class="text-xs text-muted mt-0.5 break-words">{{ t("home.stats.cards") }}</p>
			</UCard>
			<UCard class="text-center">
				<p class="text-xl font-bold text-secondary">{{ totalReviews }}</p>
				<p class="text-xs text-muted mt-0.5 break-words">{{ t("home.stats.reviews") }}</p>
			</UCard>
			<UCard class="text-center">
				<p class="text-xl font-bold text-success">{{ accuracy }}%</p>
				<p class="text-xs text-muted mt-0.5 break-words">{{ t("home.stats.accuracy") }}</p>
			</UCard>
			<UCard class="text-center">
				<div class="flex items-center justify-center gap-1">
					<UIcon name="i-lucide-flame" class="text-warning text-lg" />
					<p class="text-xl font-bold text-warning">{{ streak }}</p>
				</div>
				<p class="text-xs text-muted mt-0.5 break-words">{{ t("home.stats.streak") }}</p>
			</UCard>
		</div>

		<!-- Content Set Selector -->
		<UCard>
			<template #header>
				<h2 class="text-lg font-bold">{{ t("home.contentSelection") }}</h2>
			</template>

			<div class="space-y-3">
				<div
					class="rounded-lg border p-4 cursor-pointer transition-colors"
					:class="
						selectedLabel === undefined
							? 'border-secondary bg-secondary/10'
							: 'border-default hover:border-secondary'
					"
					@click="selectLabel(undefined)"
				>
					<div class="flex items-center gap-2">
						<UIcon name="i-lucide-layers" class="text-secondary" />
						<div>
							<p class="font-semibold">{{ t("home.allSubjects") }}</p>
							<p class="text-xs text-muted">{{ t("home.allSubjectsDesc") }}</p>
						</div>
					</div>
				</div>

				<div
					v-for="lesson in lessons"
					:key="lesson.id"
					class="rounded-lg border transition-colors overflow-hidden"
					:class="isLessonActive(lesson) ? 'border-secondary bg-secondary/10' : 'border-default'"
				>
					<!-- Lesson header — click to collapse/expand -->
					<div
						class="flex items-center gap-2 p-4 cursor-pointer select-none"
						@click="toggleLesson(lesson.id)"
					>
						<UIcon name="i-lucide-book-open" class="text-secondary shrink-0" />
						<div class="flex-1 min-w-0">
							<p class="font-semibold capitalize">{{ lesson.id }}</p>
							<p v-if="lesson.description" class="text-xs text-dimmed truncate">
								{{ lesson.description }}
							</p>
						</div>
						<UIcon
							name="i-lucide-chevron-down"
							class="text-muted shrink-0 transition-transform duration-200"
							:class="expandedLessons.has(lesson.id) ? 'rotate-180' : ''"
						/>
					</div>

					<!-- Collapsible content -->
					<div v-if="expandedLessons.has(lesson.id)" class="px-4 pb-4">
						<div class="flex flex-wrap gap-2">
							<UButton
								:variant="selectedLabel === lesson.id ? 'solid' : 'outline'"
								color="primary"
								size="xs"
								icon="i-lucide-layers"
								class="cursor-pointer"
								@click="selectLabel(lesson.id)"
							>
								{{ t("home.loadLesson") }}
							</UButton>
							<UButton
								v-for="subject in lesson.subjects"
								:key="subject"
								:variant="selectedLabel === subject ? 'solid' : 'outline'"
								color="secondary"
								size="xs"
								class="cursor-pointer"
								@click="selectLabel(subject)"
							>
								{{ subject }}
							</UButton>
						</div>
					</div>
				</div>
			</div>
		</UCard>

		<!-- Skill Rings / Progress -->
		<UCard>
			<template #header>
				<h2 class="text-lg font-bold">{{ t("home.practiceMode") }}</h2>
			</template>

			<div class="space-y-2">
				<template v-for="row in modeRows" :key="row.mode">
					<NuxtLink
						v-if="row.enabled"
						:to="lessonUrl(row.mode)"
						class="flex items-center gap-4 p-3 rounded-lg border border-default hover:border-primary hover:bg-elevated transition-colors cursor-pointer group"
					>
						<div class="p-2 rounded-md bg-primary/10 shrink-0">
							<UIcon :name="row.icon" class="text-lg text-primary block" />
						</div>
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
						<UIcon
							name="i-lucide-chevron-right"
							class="text-muted group-hover:text-primary text-lg shrink-0 transition-colors"
						/>
					</NuxtLink>

					<div
						v-else
						class="flex items-center gap-4 p-3 rounded-lg border border-default opacity-50 cursor-not-allowed"
					>
						<div class="p-2 rounded-md bg-muted/20 shrink-0">
							<UIcon :name="row.icon" class="text-lg text-muted block" />
						</div>
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
