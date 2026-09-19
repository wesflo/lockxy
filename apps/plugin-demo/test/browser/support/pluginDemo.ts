export const pluginDemoRoot = () => cy.get('lockxy-plugin-demo').shadow();

export const selectCase = (title: string): void => {
    pluginDemoRoot().find('.scenario').contains('.scenario__name', title).parents('.scenario').click();
};

export const runSelectedCase = (): void => {
    pluginDemoRoot()
        .find('.request-bar wf-button')
        .shadow()
        .find<HTMLButtonElement>('button')
        .then(([button]) => button.click());
};

export const response = () => pluginDemoRoot().find('.response-code');
