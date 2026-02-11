// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  modules: [
    "@nuxt/eslint",
    "@nuxt/icon",
    "@pinia/nuxt",
    "@vee-validate/nuxt",
  ],

  css: ["./assets/css/main.css"],

  eslint: {
    config: {
      standalone: false,
    },
  },
});
