import { checkAccessibility, createManifest, dialog, launcher, openPanel, visitPanel } from './support/panel.js';

describe('panel on small viewports', () => {
    beforeEach(() => {
        cy.viewport(320, 568);
        visitPanel(createManifest(20));
    });

    it('keeps the launcher and open panel inside the viewport', () => {
        launcher().should(($launcher) => {
            const bounds = $launcher[0]!.getBoundingClientRect();
            expect(bounds.left).to.be.at.least(0);
            expect(bounds.right).to.be.at.most(320);
        });

        openPanel();
        dialog().should(($dialog) => {
            const bounds = $dialog[0]!.getBoundingClientRect();
            expect(bounds.left).to.be.at.least(0);
            expect(bounds.right).to.be.at.most(320);
            expect(bounds.height).to.be.at.most(568);
        });
    });

    it('remains keyboard operable and accessible on mobile', () => {
        openPanel();
        dialog().find('.content').scrollTo('bottom');
        dialog().find('.close').should('be.visible');

        cy.injectAxe();
        checkAccessibility();
    });
});
