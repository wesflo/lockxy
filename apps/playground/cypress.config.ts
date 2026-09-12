import { defineConfig } from 'cypress';

import { sharedCypressConfig } from '../../cypress.base.config';

export default defineConfig({
    ...sharedCypressConfig,
    downloadsFolder: 'test-results/cypress/downloads',
    screenshotsFolder: 'test-results/cypress/screenshots',
    videosFolder: 'test-results/cypress/videos',
    e2e: {
        ...sharedCypressConfig.e2e,
        baseUrl: 'http://127.0.0.1:5174',
        specPattern: 'test/browser/**/*.cy.ts',
        supportFile: 'test/browser/support/e2e.ts',
    },
});
