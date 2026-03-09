<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
import type { CardData } from "~/composables/useCards"

const { t } = useI18n()
const { speak } = useSpeech()
const { voiceURI, rate } = useAudioSettings()

useHead(() => ({ title: t("nav.cards") }))

const { data: allLabels } = await useLabels()
const selectedLabel = ref("__all__")
const labelFilter = computed(() =>
	selectedLabel.value === "__all__" ? undefined : selectedLabel.value,
)

const { data: cards } = useCards(labelFilter)

const labelItems = computed(() => [
	{ label: t("cards.allLabels"), value: "__all__" },
	...(allLabels.value ?? []).map((l) => ({ label: l.name, value: l.name })),
])

watch(selectedLabel, () => {
	page.value = 1
})

function speakCard(text: string) {
	speak(text, "es-ES", voiceURI.value, rate.value)
}

const columns = computed<TableColumn<CardData>[]>(() => [
	{ accessorKey: "front", header: t("cards.colFront") },
	{ id: "speak", header: "" },
	{ accessorKey: "back", header: t("cards.colBack") },
	{ id: "labels", header: t("cards.colLabels") },
])

const page = ref(1)
const pageSize = 50
const pagedCards = computed(() => {
	const start = (page.value - 1) * pageSize
	return cards.value.slice(start, start + pageSize)
})
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
		<USelect v-model="selectedLabel" :items="labelItems" value-key="value" class="w-64" />

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

			<UTable v-else :columns="columns" :data="pagedCards">
				<template #speak-cell="{ row }">
					<UButton
						icon="i-lucide-volume-2"
						color="neutral"
						variant="ghost"
						size="sm"
						:aria-label="t('lesson.pronounce')"
						:title="t('lesson.pronounce')"
						@click="speakCard(row.original.front)"
					/>
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
			<div class="flex justify-center pt-4">
				<UPagination v-model:page="page" :items-per-page="pageSize" :total="cards.length" />
			</div>
		</UCard>
	</UContainer>
</template>
