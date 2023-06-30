import { defineConfig } from 'cypress'

export default defineConfig({
  videoCompression: false,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
})
