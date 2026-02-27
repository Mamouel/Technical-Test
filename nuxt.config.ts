// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },

  devServer: {
    port: 3000,
    host: "0.0.0.0",
  },

  modules: ["@nuxt/image", "nuxt-security", "nuxt-svgo", "@nuxtjs/i18n"],
  css: ["~/assets/scss/main.scss"],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/scss/_index.scss" as *;',
        },
      },
    },
  },

  svgo: {
    defaultImport: "component",
  },

  i18n: {
    defaultLocale: "en",
    locales: [
      { code: "en", language: "en-CA", name: "English", file: "en.json" },
      { code: "fr", language: "fr-CA", name: "Français", file: "fr.json" },
    ],
    skipSettingLocaleOnNavigate: true,
    strategy: "prefix_except_default",
  },

  app: {
    head: {
      title: "Ringover Technical assignment", // default fallback title
      htmlAttrs: {
        lang: "en",
      },
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },
});
