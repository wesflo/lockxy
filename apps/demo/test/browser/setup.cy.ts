describe('demo browser setup', () => {
    it('loads the plugin-only demo without the panel', () => {
        cy.visit('/');

        cy.get('lockxy-demo').should('exist');
        cy.get('wf-lockxy-panel').should('not.exist');
        cy.injectAxe();
    });
});
