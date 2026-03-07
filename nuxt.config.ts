// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	devtools: { enabled: true },
	modules: ["@nuxtjs/i18n", "@nuxt/ui", "@nuxt/eslint", "@nuxt/test-utils", "@nuxt/hints"],
	i18n: {
		defaultLocale: "es",
		locales: [
			{ code: "es", name: "🇪🇸 Español", language: "es-ES", file: "es.json" },
			{ code: "en", name: "🇬🇧 English", language: "en-GB", file: "en.json" },
			{ code: "nl", name: "🇳🇱 Nederlands", language: "nl-NL", file: "nl.json" },
		],
		langDir: "locales/",
		strategy: "no_prefix",
		detectBrowserLanguage: {
			useCookie: true,
			cookieKey: "i18n_locale",
			redirectOn: "root",
			fallbackLocale: "es",
		},
	},
	css: ["~/assets/css/main.css"],
	vite: {
		optimizeDeps: {
			include: ["dexie"],
		},
	},
})
