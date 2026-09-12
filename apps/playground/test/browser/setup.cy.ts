describe('playground browser setup', () => {
    it('loads the playground with the proxy panel', () => {
        cy.visit('/');

        cy.get('wf-mock-proxy-playground').should('exist');
        cy.get('wf-lockxy-panel').should('exist');
        cy.injectAxe();
    });
});
