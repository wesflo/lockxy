import {
    checkAccessibility,
    dialog,
    endpointsRoot,
    launcher,
    openPanel,
    panelRoot,
    settingsRoot,
    visitPanel,
} from './support/panel.js';

describe('panel keyboard and accessibility', () => {
    beforeEach(() => visitPanel());

    it('opens from the keyboard and supports tab arrow navigation', () => {
        launcher().focus().type('{enter}');
        dialog().should('have.attr', 'aria-hidden', 'false');
        panelRoot().find('.close').should('be.focused');

        cy.press(Cypress.Keyboard.Keys.TAB);
        panelRoot().find('#tab-endpoints').should('be.focused');

        panelRoot().find('#tab-endpoints').focus().type('{rightarrow}');
        panelRoot().find('#tab-settings').should('have.attr', 'aria-selected', 'true').and('be.focused');
        settingsRoot().find('h2').should('contain.text', 'General');

        panelRoot().find('#tab-settings').type('{leftarrow}');
        panelRoot().find('#tab-endpoints').should('have.attr', 'aria-selected', 'true').and('be.focused');
    });

    it('operates search and switches without a mouse', () => {
        openPanel();

        endpointsRoot().find('input[type="search"]').focus().type('profile');
        endpointsRoot().find('.endpoint').should('have.length', 1);
        endpointsRoot()
            .find('.endpoint-name')
            .should('contain.text', 'Profile')
            .and('have.attr', 'title', '/api/profile');

        endpointsRoot().find('.endpoint wf-switch').shadow().find('input').focus();
        cy.press(Cypress.Keyboard.Keys.SPACE);
        cy.getCookie('lockxy-bypass').should('have.property', 'value', 'profile');
    });

    it('reaches the scenario select by keyboard and applies its selection', () => {
        openPanel();

        cy.press(Cypress.Keyboard.Keys.TAB);
        panelRoot().find('#tab-endpoints').should('be.focused');
        cy.press(Cypress.Keyboard.Keys.TAB);
        endpointsRoot().find('.master-toggle wf-switch').shadow().find('input').should('be.focused');
        cy.press(Cypress.Keyboard.Keys.TAB);
        endpointsRoot().find('input[type="search"]').should('be.focused');
        cy.press(Cypress.Keyboard.Keys.TAB);
        endpointsRoot().find('.endpoint').first().find('select').should('be.focused').select('failure');
        endpointsRoot().find('.endpoint').first().find('select').should('have.value', 'failure');
        cy.getCookie('lockxy-scenarios').should('have.property', 'value', 'orders%3Afailure');
    });

    it('has no detectable accessibility violations when closed or open', () => {
        cy.injectAxe();
        checkAccessibility();

        openPanel();
        checkAccessibility();
    });

    it('has no detectable accessibility violations in settings', () => {
        openPanel();
        panelRoot().find('#tab-settings').click();
        settingsRoot().find('h2').should('be.visible');

        cy.injectAxe();
        checkAccessibility();
    });
});
