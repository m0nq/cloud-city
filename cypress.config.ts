import { defineConfig } from 'cypress';

export default defineConfig({
    e2e: {
        baseUrl: 'http://localhost:8000',
        specPattern: 'cypress/e2e',
        experimentalStudio: true,
        setupNodeEvents(on: any, config: any) {
            // implement node event listeners here
        }
    }
});
