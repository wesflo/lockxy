export const demoRoot = () => cy.get('lockxy-demo').shadow();

export const selectCase = (title: string): void => {
    demoRoot().find('.scenario').contains('.scenario__name', title).parents('.scenario').click();
};

export const runSelectedCase = (): void => {
    demoRoot()
        .find('.request-bar wf-button')
        .shadow()
        .find<HTMLButtonElement>('button')
        .then(([button]) => button.click());
};

export const response = () => demoRoot().find('.response-code');
