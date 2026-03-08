<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui"

const { t, locale, locales, setLocale } = useI18n()

useHead({ titleTemplate: (title) => (title ? `${title} · Vamos` : "Vamos") })
const { speak, spanishVoices } = useSpeech()
const { autoPlay, voiceURI, rate, setAutoPlay, setVoiceURI, setRate } = useAudioSettings()

const navItems = computed<NavigationMenuItem[]>(() => [
	{ label: t("nav.home"), to: "/", icon: "i-lucide-house" },
	{ label: t("nav.lesson"), to: "/lesson", icon: "i-lucide-book-open" },
	{ label: t("nav.cards"), to: "/cards", icon: "i-lucide-layers" },
])

const localeOptions = computed(() => locales.value.map((l) => ({ label: l.name, value: l.code })))

const voiceOptions = computed(() =>
	spanishVoices.value.map((v) => ({
		label: `${v.name} (${v.lang})`,
		value: v.uri,
	})),
)

const audioSettingsOpen = ref(false)
const currentYear = new Date().getFullYear()

function testVoice() {
	speak("Hola, ¿cómo estás?", "es-ES", voiceURI.value, rate.value)
}
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
				<UTooltip :text="t('lesson.audioSettings')" class="hidden sm:block">
					<UButton
						icon="i-lucide-volume-2"
						color="neutral"
						variant="ghost"
						size="sm"
						:aria-label="t('lesson.audioSettings')"
						@click="audioSettingsOpen = true"
					/>
				</UTooltip>
				<UColorModeButton class="hidden sm:inline-flex" />
			</template>

			<template #body>
				<UNavigationMenu :items="navItems" orientation="vertical" class="-mx-2.5" />
				<USeparator class="my-3" />
				<div class="flex items-center gap-2 px-1">
					<UButton
						icon="i-lucide-volume-2"
						color="neutral"
						variant="ghost"
						:label="t('lesson.audioSettings')"
						@click="audioSettingsOpen = true"
					/>
					<UColorModeButton />
				</div>
			</template>
		</UHeader>

		<UMain>
			<NuxtPage />
		</UMain>

		<UFooter>
			<template #left>
				<p class="text-sm text-muted">Vamos · Tomas Klingen {{ currentYear }}</p>
			</template>
		</UFooter>

		<USlideover v-model:open="audioSettingsOpen" :title="t('lesson.audioSettings')">
			<template #body>
				<div class="space-y-6 p-4">
					<div class="flex items-center justify-between">
						<div>
							<p class="font-medium">{{ t("lesson.autoPlay") }}</p>
							<p class="text-sm text-muted">{{ t("lesson.autoPlayDescription") }}</p>
						</div>
						<USwitch :model-value="autoPlay" @update:model-value="setAutoPlay($event)" />
					</div>

					<div class="space-y-2">
						<p class="font-medium">{{ t("lesson.voice") }}</p>
						<p class="text-sm text-muted">{{ t("lesson.voiceDescription") }}</p>
						<USelect
							:model-value="voiceURI ?? undefined"
							:items="voiceOptions"
							:placeholder="t('lesson.voiceDefault')"
							class="w-full"
							@update:model-value="setVoiceURI($event ?? null)"
						/>
					</div>

					<div class="space-y-3">
						<div class="flex items-center justify-between">
							<p class="font-medium">{{ t("lesson.speechRate") }}</p>
							<span class="text-sm text-muted tabular-nums">{{ rate.toFixed(2) }}×</span>
						</div>
						<USlider
							:model-value="rate"
							:min="0.2"
							:max="1"
							:step="0.05"
							@update:model-value="setRate($event ?? rate)"
						/>
						<div class="flex justify-between text-xs text-muted">
							<span>{{ t("lesson.speechRateSlow") }}</span>
							<span>{{ t("lesson.speechRateNormal") }}</span>
							<span>{{ t("lesson.speechRateFast") }}</span>
						</div>
					</div>

					<UButton
						icon="i-lucide-volume-2"
						variant="outline"
						:label="t('lesson.testVoice')"
						@click="testVoice"
					/>
				</div>
			</template>
		</USlideover>
	</UApp>
</template>
