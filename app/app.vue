<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui"

const { t, locale, locales, setLocale } = useI18n()

const navItems = computed<NavigationMenuItem[]>(() => [
	{ label: t("nav.home"), to: "/", icon: "i-lucide-house" },
	{ label: t("nav.lesson"), to: "/lesson", icon: "i-lucide-book-open" },
	{ label: t("nav.cards"), to: "/cards", icon: "i-lucide-layers" },
])

const localeOptions = computed(() => locales.value.map((l) => ({ label: l.name, value: l.code })))
</script>

<template>
	<UApp>
		<UHeader>
			<template #title>
				<span class="font-bold text-xl tracking-tight">🇪🇸 Vamos</span>
			</template>

			<UNavigationMenu :items="navItems" />

			<template #right>
				<USelect
					:model-value="locale"
					:items="localeOptions"
					size="sm"
					class="w-32"
					@update:model-value="setLocale($event)"
				/>
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
				<p class="text-sm text-muted">{{ t("footer.tagline") }}</p>
			</template>
		</UFooter>
	</UApp>
</template>
