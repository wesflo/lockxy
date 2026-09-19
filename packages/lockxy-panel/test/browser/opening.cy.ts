import { dialog, launcher, openPanel, panelRoot, visitPanel } from './support/panel.js';

describe('panel opening and closing', () => {
    beforeEach(() => visitPanel());

    it('opens with correct state and moves focus into the panel', () => {
        launcher().should('have.attr', 'aria-expanded', 'false');
        dialog().should('have.attr', 'aria-hidden', 'true');

        openPanel();

        launcher().should('have.attr', 'aria-expanded', 'true');
        panelRoot().find('.close').should('be.focused');
    });

    it('closes with Escape and returns focus to the launcher', () => {
        openPanel();

        panelRoot().find('.close').type('{esc}');

        dialog().should('have.attr', 'aria-hidden', 'true');
        launcher().should('have.attr', 'aria-expanded', 'false').and('be.focused');
    });

    it('closes through both the close button and backdrop', () => {
        openPanel();
        panelRoot().find('.close').click();
        dialog().should('have.attr', 'aria-hidden', 'true');

        openPanel();
        panelRoot().find('.backdrop').click({ force: true });
        dialog().should('have.attr', 'aria-hidden', 'true');
    });

    it('can be opened and closed repeatedly without losing behavior', () => {
        for (let index = 0; index < 3; index += 1) {
            launcher().click();
            dialog().should('have.attr', 'aria-hidden', 'false');
            panelRoot().find('.close').type('{esc}');
            dialog().should('have.attr', 'aria-hidden', 'true');
        }
    });
});
