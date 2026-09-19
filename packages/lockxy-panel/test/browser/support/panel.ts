import type { MockManifest } from '../../../src/interface.js';

export const defaultManifest: MockManifest = {
    id: 'browser-test',
    endpoints: [
        {
            id: 'orders',
            label: 'Orders',
            method: 'GET',
            path: '/api/orders',
            scenarios: [
                { id: 'success', label: 'Success' },
                { id: 'failure', label: 'Server error' },
            ],
        },
        {
            id: 'profile',
            label: 'Profile',
            method: ['GET', 'PUT'],
            path: '/api/profile',
        },
    ],
};

export const createManifest = (endpointCount: number): MockManifest => ({
    id: 'large-browser-test',
    endpoints: Array.from({ length: endpointCount }, (_, index) => {
        const number = String(index + 1).padStart(3, '0');
        return {
            id: `endpoint-${number}`,
            label: `Generated endpoint ${number}`,
            method: index % 2 ? 'POST' : 'GET',
            path: `/api/generated/${number}/${'long-path-segment-'.repeat(3)}`,
            scenarios: [
                { id: 'success', label: 'Success response' },
                { id: 'failure', label: 'Failure response' },
            ],
        };
    }),
});

export const visitPanel = (manifest: MockManifest = defaultManifest): void => {
    cy.intercept('GET', '/_lockxy/manifest', { body: manifest }).as('manifest');
    cy.visit('/');
    cy.wait('@manifest');
    launcher().should('be.visible');
};

export const panelRoot = () => cy.get('wf-lockxy-panel').shadow();

export const launcher = () => panelRoot().find<HTMLButtonElement>('.launcher');

export const dialog = () => panelRoot().find<HTMLElement>('[role="dialog"]');

export const endpointsRoot = () => panelRoot().find('wf-lockxy-panel-endpoints').shadow();

export const settingsRoot = () => panelRoot().find('wf-lockxy-panel-settings').shadow();

export const openPanel = (): void => {
    launcher().click();
    dialog().should('have.attr', 'aria-hidden', 'false').and('be.visible');
};

export const checkAccessibility = (): void => {
    cy.checkA11y(
        undefined,
        undefined,
        (violations) => {
            const details = violations
                .map(({ help, id, nodes }) => `${id}: ${help}\n${nodes.map(({ html }) => `  ${html}`).join('\n')}`)
                .join('\n');
            expect(violations, details).to.have.length(0);
        },
        true
    );
};
