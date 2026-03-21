// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	devtools: { enabled: true },
	modules: ["@nuxtjs/i18n", "@nuxt/ui", "@nuxt/eslint", "@nuxt/test-utils", "@nuxt/hints"],
	i18n: {
		defaultLocale: "nl",
		locales: [{ code: "nl", name: "Nederlands", language: "nl-NL", file: "nl.json" }],
		langDir: "locales/",
		strategy: "no_prefix",
	},
	css: ["~/assets/css/main.css"],
	vite: {
		optimizeDeps: {
			include: ["dexie"],
		},
	},
})
