export const panelPlaygroundRoot = () => cy.get('wf-lockxy-panel-playground').shadow();

export const panelRoot = () => cy.get('wf-lockxy-panel').shadow();

export const endpointsRoot = () => panelRoot().find('wf-lockxy-panel-endpoints').shadow();

export const openPanel = (): void => {
    panelRoot().find('.launcher').click();
    panelRoot().find('[role="dialog"]').should('have.attr', 'aria-hidden', 'false');
};

export const selectRequest = (label: string): void => {
    panelPlaygroundRoot().find('.request').contains('.request__copy strong', label).parents('.request').click();
};

export const runRequest = (): void => {
    panelPlaygroundRoot()
        .find('.request-meta wf-button')
        .shadow()
        .find<HTMLButtonElement>('button')
        .then(([button]) => button.click());
};

export const filterPanel = (query: string): void => {
    endpointsRoot().find('input[type="search"]').clear().type(query);
};

export const resultBody = () => panelPlaygroundRoot().find('.preview pre');
