describe('panel browser setup', () => {
    it('loads the isolated panel with a controlled manifest', () => {
        cy.intercept('GET', '/_lockxy/manifest', {
            body: {
                id: 'browser-test',
                endpoints: [{ id: 'users', method: 'GET', path: '/api/users' }],
            },
        });

        cy.visit('/');

        cy.get('wf-lockxy-panel').shadow().find('.launcher').should('be.visible');
        cy.injectAxe();
    });
});
