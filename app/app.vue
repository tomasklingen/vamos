<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui"

const navItems: NavigationMenuItem[] = [
	{ label: "Inicio", to: "/", icon: "i-lucide-house" },
	{ label: "Lección", to: "/lesson", icon: "i-lucide-book-open" },
	{ label: "Marcador", to: "/leaderboard", icon: "i-lucide-trophy" },
]
</script>

<template>
	<UApp>
		<UHeader>
			<template #title>
				<span class="font-bold text-xl tracking-tight">🇪🇸 Vamos</span>
			</template>

			<UNavigationMenu :items="navItems" />

			<template #right>
				<UColorModeButton />
			</template>

			<template #body>
				<UNavigationMenu :items="navItems" orientation="vertical" class="-mx-2.5" />
			</template>
		</UHeader>

		<UMain>
			<NuxtPage />
		</UMain>

		<UFooter>
			<template #left>
				<p class="text-sm text-muted">🇪🇸 Vamos — ¡tú puedes!</p>
			</template>
		</UFooter>
	</UApp>
</template>
