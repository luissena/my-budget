import path from "path";

export default defineNuxtConfig({
  modules: ["nuxt-primevue", "@nuxtjs/tailwindcss"],
  primevue: {
    importPT: { from: path.resolve(__dirname, "./presets/lara/") },
    options: {
      unstyled: true,
    },
  },

  css: [
    "primevue/resources/themes/aura-light-green/theme.css",
    "primeicons/primeicons.css",
    "~/assets/css/main.css",
  ],
});
