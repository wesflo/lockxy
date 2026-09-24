import { createManifest, endpointsRoot, openPanel, visitPanel } from './support/panel.js';

describe('panel with a large manifest', () => {
    beforeEach(() => visitPanel(createManifest(100)));

    it('renders and operates one hundred endpoints', () => {
        openPanel();
        endpointsRoot().find('.endpoint').should('have.length', 100);

        endpointsRoot().find('input[type="search"]').type('endpoint-100');
        endpointsRoot().find('.endpoint').should('have.length', 1).and('contain.text', '/generated/100/');

        endpointsRoot().find('.endpoint select').select('failure');
        cy.getCookie('lockxy-scenarios').should('have.property', 'value', 'endpoint-100%3Afailure');

        endpointsRoot().find('.endpoint wf-switch').shadow().find('span').click();
        cy.getCookie('lockxy-bypass').should('have.property', 'value', 'endpoint-100');
    });

    it('shows a useful empty state for a query without matches', () => {
        openPanel();
        endpointsRoot().find('input[type="search"]').type('does-not-exist');

        endpointsRoot().find('.endpoint').should('not.exist');
        endpointsRoot().find('.empty').should('contain.text', 'No matching endpoints found');
    });
});
