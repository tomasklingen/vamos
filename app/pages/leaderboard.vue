<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"

definePageMeta({ title: "Marcador" })

interface Player {
	name: string
	emoji: string
	level: number
	xp: number
	streak: number
	lessons: number
	rank: number
}

const players: Player[] = [
	{ name: "Player 1", emoji: "🦁", level: 4, xp: 340, streak: 7, lessons: 12, rank: 1 },
	{ name: "Player 2", emoji: "🐯", level: 3, xp: 210, streak: 3, lessons: 8, rank: 2 },
]

const columns: TableColumn<Player>[] = [
	{ accessorKey: "rank", header: "🏅" },
	{ accessorKey: "name", header: "Jugador" },
	{ accessorKey: "level", header: "Nivel" },
	{ accessorKey: "xp", header: "XP" },
	{ accessorKey: "streak", header: "Racha" },
	{ accessorKey: "lessons", header: "Lecciones" },
]
</script>

<template>
	<UContainer class="py-10 space-y-8">
		<div class="text-center space-y-2">
			<p class="text-5xl">🏆</p>
			<h1 class="text-4xl font-bold">Marcador</h1>
			<p class="text-muted text-lg">¿Quién aprende más rápido?</p>
		</div>

		<!-- Player Cards -->
		<div class="grid grid-cols-2 gap-4">
			<UCard
				v-for="player in players"
				:key="player.name"
				:class="player.rank === 1 ? 'ring-2 ring-yellow-400' : ''"
			>
				<div class="flex flex-col items-center gap-3 py-3 text-center">
					<span class="text-5xl">{{ player.rank === 1 ? "🥇" : "🥈" }}</span>
					<span class="text-4xl">{{ player.emoji }}</span>
					<p class="font-bold text-lg">{{ player.name }}</p>
					<UBadge
						:label="`Nivel ${player.level}`"
						:color="player.rank === 1 ? 'primary' : 'secondary'"
						variant="subtle"
					/>
					<div class="w-full mt-1 space-y-1.5 text-sm">
						<div class="flex justify-between">
							<span class="text-muted">XP</span>
							<span class="font-bold">{{ player.xp }}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-muted">Racha</span>
							<span class="font-bold">🔥 {{ player.streak }} días</span>
						</div>
						<div class="flex justify-between">
							<span class="text-muted">Lecciones</span>
							<span class="font-bold">{{ player.lessons }}</span>
						</div>
					</div>
				</div>
			</UCard>
		</div>

		<!-- Comparison Table -->
		<UCard>
			<template #header>
				<p class="font-bold text-lg">📊 Comparación completa</p>
			</template>
			<UTable :columns="columns" :data="players">
				<template #rank-cell="{ row }">
					{{ row.original.rank === 1 ? "🥇" : "🥈" }}
				</template>
				<template #name-cell="{ row }">
					<span class="font-medium">{{ row.original.emoji }} {{ row.original.name }}</span>
				</template>
				<template #streak-cell="{ row }"> 🔥 {{ row.original.streak }} </template>
			</UTable>
		</UCard>
	</UContainer>
</template>
