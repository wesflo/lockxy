import {
    endpointsRoot,
    filterPanel,
    openPanel,
    panelRoot,
    panelPlaygroundRoot,
    resultBody,
    runRequest,
    selectRequest,
} from './support/panelPlayground.js';

describe('panel and plugin integration', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.get('wf-lockxy-panel-playground').should('exist');
        cy.get('wf-lockxy-panel').should('exist');
    });

    it('selects a manifest scenario in the panel and applies it to an app request', () => {
        selectRequest('HTTP errors');
        openPanel();
        filterPanel('/errors');
        endpointsRoot().find('.endpoint').should('have.length', 1).find('select').select('server-error');
        panelRoot().find('.close').click();

        runRequest();

        panelPlaygroundRoot().find('.result-meta strong').should('contain.text', '500');
        resultBody()
            .should('contain.text', 'server-error')
            .and('contain.text', 'simulated service intentionally failed');
    });

    it('bypasses one endpoint and can enable it again', () => {
        selectRequest('JSON response');
        openPanel();
        filterPanel('/json');
        endpointsRoot().find('.endpoint:not(.controlled)').find('wf-switch').shadow().find('span').click();
        panelRoot().find('.close').click();

        runRequest();
        resultBody().should('contain.text', '<!doctype html>');

        openPanel();
        endpointsRoot().find('.endpoint:not(.controlled)').find('wf-switch').shadow().find('span').click();
        panelRoot().find('.close').click();
        runRequest();

        resultBody().should('contain.text', 'explicit-json').and('contain.text', 'scenarios/explicit.json');
    });

    it('bypasses all mocks with the master switch and restores them', () => {
        selectRequest('Method-specific file');
        openPanel();
        endpointsRoot().find('.master-toggle wf-switch').shadow().find('span').click();
        panelRoot().find('.close').click();

        runRequest();
        panelPlaygroundRoot().find('.result-meta strong').should('contain.text', '404');
        resultBody().should('contain.text', '(empty response body)');

        openPanel();
        endpointsRoot().find('.master-toggle wf-switch').shadow().find('span').click();
        panelRoot().find('.close').click();
        runRequest();

        resultBody().should('contain.text', 'method-precedence');
    });
});
