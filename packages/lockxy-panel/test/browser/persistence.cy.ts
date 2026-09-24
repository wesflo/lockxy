import { endpointsRoot, openPanel, panelRoot, settingsRoot, visitPanel } from './support/panel.js';

describe('panel persistence and reset', () => {
    beforeEach(() => visitPanel());

    it('restores saved endpoint and scenario selections after reload', () => {
        openPanel();
        panelRoot().find('#tab-settings').click();
        settingsRoot().find('wf-switch').eq(1).shadow().find('span').click();

        panelRoot().find('#tab-endpoints').click();
        endpointsRoot().find('.endpoint').first().find('select').select('failure');
        endpointsRoot().find('.endpoint').first().find('wf-switch').shadow().find('span').click();

        cy.reload();
        openPanel();
        endpointsRoot().find('.endpoint').first().find('select').should('have.value', 'failure');
        endpointsRoot().find('.endpoint').first().find('wf-switch').shadow().find('input').should('not.be.checked');
    });

    it('removes browser state and restores defaults through reset', () => {
        openPanel();
        panelRoot().find('#tab-settings').click();
        settingsRoot().find('wf-switch').eq(1).shadow().find('span').click();

        panelRoot().find('#tab-endpoints').click();
        endpointsRoot().find('.endpoint').first().find('select').select('failure');
        endpointsRoot().find('footer wf-button').shadow().find('button').click({ force: true });

        cy.getCookie('lockxy-bypass').should('have.property', 'value', '');
        cy.getCookie('lockxy-scenarios').should('have.property', 'value', '');
        cy.window().then((window) => {
            expect(Object.keys(window.localStorage).filter((key) => key.startsWith('lockxy-'))).to.deep.equal([]);
        });
    });
});
