import { defaultManifest, endpointsRoot, launcher, openPanel, panelRoot, settingsRoot } from './support/panel.js';

describe('panel manifest states', () => {
    it('shows a load error and recovers through retry', () => {
        let requests = 0;
        cy.intercept('GET', '/_lockxy/manifest', (request) => {
            requests += 1;
            request.reply(requests === 1 ? { statusCode: 500 } : { body: defaultManifest });
        }).as('manifest');

        cy.visit('/');
        cy.wait('@manifest');
        launcher().should('be.visible');
        openPanel();
        endpointsRoot().find('[role="alert"]').should('contain.text', 'HTTP 500');

        endpointsRoot().find('.retry').click();
        cy.wait('@manifest');
        endpointsRoot().find('.endpoint').should('have.length', defaultManifest.endpoints.length);
    });

    it('does not mount a launcher for an empty manifest', () => {
        cy.intercept('GET', '/_lockxy/manifest', { body: { id: 'empty', endpoints: [] } }).as('manifest');
        cy.visit('/');
        cy.wait('@manifest');

        panelRoot().find('.launcher').should('not.exist');
    });

    it('disables project-specific persistence without a manifest id', () => {
        cy.intercept('GET', '/_lockxy/manifest', {
            body: { endpoints: defaultManifest.endpoints },
        }).as('manifest');
        cy.visit('/');
        cy.wait('@manifest');
        openPanel();
        panelRoot().find('#tab-settings').click();

        settingsRoot().find('[role="note"]').should('contain.text', 'Project storage is unavailable');
        settingsRoot().find('wf-switch').eq(1).shadow().find('input').should('be.disabled');
    });
});
