import type { MockEndpoint, MockScenario, ScenarioSelections } from '../../../interface.js';

export const findSelectedScenario = (
    endpoint: MockEndpoint,
    selections: ScenarioSelections
): MockScenario | undefined => {
    const scenarioId = selections.get(endpoint.id);

    if (!scenarioId) {
        return undefined;
    }

    return endpoint.scenarios.find((scenario) => scenario.id === scenarioId);
};
