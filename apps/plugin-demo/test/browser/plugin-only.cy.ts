describe('plugin-only usage', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.clearCookies();
    });

    it('loads the demo without mounting the proxy panel', () => {
        cy.get('lockxy-plugin-demo').should('exist');
        cy.get('wf-lockxy-panel').should('not.exist');
    });

    it('resolves convention files without any Lockxy cookie', () => {
        cy.getAllCookies().should('have.length', 0);

        cy.request({ method: 'PUT', url: '/api/demo/users/profile' }).then((result) => {
            expect(result.status).to.equal(200);
            expect(result.headers).to.have.property('x-lockxy', 'true');
            expect(result.body).to.include({ case: 'root-method-fallback', source: 'PUT_profile.json' });
        });
    });

    it('applies endpoint defaults without a scenario selection', () => {
        cy.getAllCookies().should('have.length', 0);

        cy.request('/api/demo/endpoint-defaults').then((result) => {
            expect(result.status).to.equal(202);
            expect(result.headers).to.have.property('x-lockxy', 'true');
            expect(result.body).to.include({ case: 'endpoint-defaults' });
        });
    });

    it('uses an automatic single scenario without a cookie', () => {
        cy.getAllCookies().should('have.length', 0);

        cy.request('/api/demo/automatic').then((result) => {
            expect(result.status).to.equal(200);
            expect(result.body).to.include({ case: 'automatic-file' });
        });
    });
});
