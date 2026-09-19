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

    it('replaces root-controlled endpoint content with the manifest notice', () => {
        cy.intercept('GET', '/_lockxy/manifest', {
            body: { id: 'root-controlled', preventMock: true, endpoints: [] },
        }).as('manifest');
        cy.visit('/');
        cy.wait('@manifest');
        openPanel();

        endpointsRoot()
            .find('.root-manifest-control a')
            .should('contain.text', 'Controlled by manifest')
            .and('have.attr', 'target', '_blank')
            .and('have.attr', 'href')
            .and('include', '/control-hierarchy/#manifest-controls');
        endpointsRoot().find('.master-toggle, .search, .endpoint').should('not.exist');
    });

    it('greys out endpoint-level and scenario-level manifest controls', () => {
        cy.intercept('GET', '/_lockxy/manifest', {
            body: {
                id: 'controlled-endpoints',
                endpoints: [
                    { id: 'profile', path: '/api/profile', preventMock: true },
                    {
                        id: 'orders',
                        path: '/api/orders',
                        scenarios: [{ id: 'success', active: true }, { id: 'failure' }],
                    },
                    { id: 'health', path: '/api/health' },
                ],
            },
        }).as('manifest');
        cy.visit('/');
        cy.wait('@manifest');
        openPanel();

        endpointsRoot()
            .find('.endpoint.controlled')
            .should('have.length', 2)
            .each(($endpoint) => {
                cy.wrap($endpoint)
                    .find('.manifest-control')
                    .should('contain.text', 'Controlled by manifest')
                    .and('have.attr', 'target', '_blank');
                cy.wrap($endpoint).find('wf-switch, select').should('not.exist');
            });
        endpointsRoot().find('.endpoint:not(.controlled)').should('have.length', 1).find('wf-switch').should('exist');
    });
});
