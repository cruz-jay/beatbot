const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3001",
    // supportFile: "cypress/support/e2e.js",
    supportFile: false,
  },
  video: false,
  viewportWidth: 1000,
  viewportHeight: 660,
});
