// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },

  devServer: {
    port: 3000,
    host: "0.0.0.0",
  },

  modules: ["@nuxt/image", "nuxt-security", "nuxt-svgo"],
  css: ["~/assets/scss/main.scss"],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData:
            '@use "~/assets/scss/_colors.scss" as *; @use "~/assets/scss/_variables.scss" as *; @use "~/assets/scss/_mixins.scss" as *; @use "~/assets/scss/_fonts.scss" as *;',
        },
      },
    },
  },

  svgo: {
    defaultImport: "component",
  },
});
