<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"

definePageMeta({ title: "Tarjetas" })

interface Card {
	id: number
	front: string
	back: string
	category: string
	created_at: string
}

const { data: cards, refresh } = await useFetch<Card[]>("/api/cards")

const front = ref("")
const back = ref("")
const category = ref("custom")
const adding = ref(false)

const categories = ["custom", "greeting", "goodbye", "number"]

async function addCard() {
	if (!front.value.trim() || !back.value.trim()) return
	adding.value = true
	await $fetch("/api/cards", {
		method: "POST",
		body: { front: front.value, back: back.value, category: category.value },
	})
	front.value = ""
	back.value = ""
	adding.value = false
	await refresh()
}

async function deleteCard(id: number) {
	await $fetch(`/api/cards/${id}`, { method: "DELETE" })
	await refresh()
}

const columns: TableColumn<Card>[] = [
	{ accessorKey: "front", header: "Español" },
	{ accessorKey: "back", header: "Traducción" },
	{ accessorKey: "category", header: "Categoría" },
	{ id: "actions", header: "" },
]
</script>

<template>
	<UContainer class="py-10 space-y-8">
		<div class="flex items-center justify-between">
			<h1 class="text-2xl font-bold">🗂️ Tarjetas</h1>
			<UBadge :label="`${cards?.length ?? 0} tarjetas`" color="primary" variant="subtle" size="lg" />
		</div>

		<!-- Add card form -->
		<UCard>
			<template #header>
				<p class="font-bold text-lg">➕ Añadir tarjeta</p>
			</template>

			<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
				<UInput v-model="front" placeholder="Español (ej. Hola)" size="lg" />
				<UInput v-model="back" placeholder="Traducción (ej. Hello)" size="lg" />
				<USelect
					v-model="category"
					:items="categories"
					size="lg"
				/>
			</div>

			<template #footer>
				<UButton
					label="Añadir"
					icon="i-lucide-plus"
					size="lg"
					:loading="adding"
					:disabled="!front.trim() || !back.trim()"
					@click="addCard"
				/>
			</template>
		</UCard>

		<!-- Cards table -->
		<UCard>
			<template #header>
				<p class="font-bold text-lg">📋 Todas las tarjetas</p>
			</template>

			<div v-if="!cards?.length" class="text-center py-10 text-muted">
				No hay tarjetas todavía. ¡Añade algunas arriba!
			</div>

			<UTable v-else :columns="columns" :data="cards">
				<template #category-cell="{ row }">
					<UBadge :label="row.original.category" color="neutral" variant="subtle" size="sm" />
				</template>
				<template #actions-cell="{ row }">
					<UButton
						icon="i-lucide-trash-2"
						color="error"
						variant="ghost"
						size="sm"
						@click="deleteCard(row.original.id)"
					/>
				</template>
			</UTable>
		</UCard>
	</UContainer>
</template>
