import { demoRoot, response, runSelectedCase, selectCase } from './support/demo.js';

describe('demo interaction', () => {
    beforeEach(() => cy.visit('/'));

    it('runs a convention response through the UI', () => {
        selectCase('Method-specific file');
        runSelectedCase();

        response().should('contain.text', 'method-precedence').and('contain.text', 'demo/POST_orders.json');
        demoRoot().find('.request-bar wf-badge').should('contain.text', '200');
    });

    it('selects and renders an intentional error response', () => {
        selectCase('Internal Server Error');
        runSelectedCase();

        response().should('contain.text', 'server-error').and('contain.text', 'simulated service intentionally failed');
        demoRoot().find('.request-bar wf-badge').should('contain.text', '500');
        cy.getCookie('lockxy-scenarios').then((cookie) => {
            expect(decodeURIComponent(cookie?.value ?? '')).to.contain('http-errors:server-error');
        });
    });

    it('handles a real empty 204 response and resets the session', () => {
        selectCase('No Content');
        runSelectedCase();

        demoRoot().find('.request-bar wf-badge').should('contain.text', '204');
        response().should('contain.text', '// Run this scenario to inspect its response.');

        demoRoot()
            .find('.preview .section-header wf-button')
            .shadow()
            .find<HTMLButtonElement>('button')
            .then(([button]) => button.click());
        cy.getCookie('lockxy-scenarios').should('have.property', 'value', '');
        response().should('contain.text', '// Run this scenario to inspect its response.');
    });
});
