<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
import type { CardData } from "~/composables/useCards"

const { t } = useI18n()
const { speak } = useSpeech()
const { voiceURI, rate } = useAudioSettings()

useHead(() => ({ title: t("nav.cards") }))

const { data: allLabels } = await useLabels()
const selectedLabel = ref<string | undefined>(undefined)

const { data: cards } = useCards(selectedLabel)

const labelItems = computed(() => [
	{ label: t("cards.allLabels"), value: undefined },
	...(allLabels.value ?? []).map((l) => ({ label: l.name, value: l.name })),
])

function speakCard(text: string) {
	speak(text, "es-ES", voiceURI.value, rate.value)
}

const columns = computed<TableColumn<CardData>[]>(() => [
	{ accessorKey: "front", header: t("cards.colFront") },
	{ id: "speak", header: "" },
	{ accessorKey: "back", header: t("cards.colBack") },
	{ id: "labels", header: t("cards.colLabels") },
])
</script>

<template>
	<UContainer class="py-10 space-y-8">
		<div class="flex items-center justify-between">
			<h1 class="text-2xl font-bold flex items-center gap-2">
				<UIcon name="i-lucide-layers" /> {{ t("cards.heading") }}
			</h1>
			<UBadge
				:label="t('cards.count', { n: cards.length })"
				color="primary"
				variant="subtle"
				size="lg"
			/>
		</div>

		<!-- Label filter -->
		<USelect v-model="selectedLabel" :items="labelItems" value-key="value" class="w-48" />

		<!-- Cards table -->
		<UCard>
			<template #header>
				<p class="font-bold text-lg flex items-center gap-2">
					<UIcon name="i-lucide-table" /> {{ t("cards.allCards") }}
				</p>
			</template>

			<div v-if="!cards.length" class="text-center py-10 text-muted">
				{{ t("cards.empty") }}
			</div>

			<UTable v-else :columns="columns" :data="cards">
				<template #speak-cell="{ row }">
					<UTooltip :text="t('lesson.pronounce')">
						<UButton
							icon="i-lucide-volume-2"
							color="neutral"
							variant="ghost"
							size="sm"
							:aria-label="t('lesson.pronounce')"
							@click="speakCard(row.original.front)"
						/>
					</UTooltip>
				</template>
				<template #labels-cell="{ row }">
					<div class="flex gap-1 flex-wrap">
						<UBadge
							v-for="label in row.original.labels"
							:key="label"
							:label="label"
							color="neutral"
							variant="subtle"
							size="sm"
						/>
					</div>
				</template>
			</UTable>
		</UCard>
	</UContainer>
</template>
