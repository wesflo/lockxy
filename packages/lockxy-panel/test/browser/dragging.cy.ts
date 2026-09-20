import { launcher, visitPanel } from './support/panel.js';

const dragLauncher = (clientX: number, clientY: number): void => {
    launcher().then(($launcher) => {
        const bounds = $launcher[0]!.getBoundingClientRect();
        cy.wrap($launcher)
            .trigger('pointerdown', {
                clientX: bounds.left + bounds.width / 2,
                clientY: bounds.top + bounds.height / 2,
                ctrlKey: true,
                pointerId: 1,
            })
            .trigger('pointermove', { clientX, clientY, pointerId: 1 })
            .trigger('pointerup', { clientX, clientY, pointerId: 1 });
    });
};

describe('panel launcher position', () => {
    beforeEach(() => {
        cy.viewport(1000, 700);
        visitPanel();
    });

    it('moves with the documented modifier and persists its position', () => {
        dragLauncher(400, 300);

        launcher().should(($launcher) => {
            const bounds = $launcher[0]!.getBoundingClientRect();
            expect(bounds.left).to.be.closeTo(380, 1);
            expect(bounds.top).to.be.closeTo(280, 1);
        });
        cy.window().then((window) => {
            expect(JSON.parse(window.localStorage.getItem('lockxy-button-position') ?? '')).to.deep.equal({
                x: 380,
                y: 280,
            });
        });

        cy.reload();
        launcher().should(($launcher) => {
            const bounds = $launcher[0]!.getBoundingClientRect();
            expect(bounds.left).to.be.closeTo(380, 1);
            expect(bounds.top).to.be.closeTo(280, 1);
        });
    });

    it('cannot be dragged beyond any viewport edge', () => {
        dragLauncher(-500, -500);
        launcher().should(($launcher) => {
            const bounds = $launcher[0]!.getBoundingClientRect();
            expect(bounds.left).to.be.at.least(0);
            expect(bounds.top).to.be.at.least(0);
        });

        dragLauncher(2000, 2000);
        launcher().should(($launcher) => {
            const bounds = $launcher[0]!.getBoundingClientRect();
            expect(bounds.right).to.be.at.most(1000);
            expect(bounds.bottom).to.be.at.most(700);
        });
    });

    it('clamps a stored position and responds to viewport resizing', () => {
        cy.window().then((window) => {
            window.localStorage.setItem('lockxy-button-position', JSON.stringify({ x: 5000, y: -200 }));
        });
        cy.reload();

        launcher().should(($launcher) => {
            const bounds = $launcher[0]!.getBoundingClientRect();
            expect(bounds.right).to.be.at.most(1000);
            expect(bounds.top).to.be.at.least(0);
        });

        cy.viewport(320, 480);
        cy.wait(250);
        launcher().should(($launcher) => {
            const bounds = $launcher[0]!.getBoundingClientRect();
            expect(bounds.right).to.be.at.most(320);
            expect(bounds.bottom).to.be.at.most(480);
        });
    });
});
