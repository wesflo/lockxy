import type { MockEndpoint, MockScenario, ScenarioSelections } from '../../../interface.js';

export const findSelectedScenario = (
    endpoint: MockEndpoint,
    selections: ScenarioSelections
): MockScenario | undefined => {
    const scenarios = endpoint.scenarios ?? [];

    if (scenarios.length === 1) {
        return scenarios[0];
    }

    if (!endpoint.id) {
        return undefined;
    }

    const scenarioId = selections.get(endpoint.id);

    if (!scenarioId) {
        return undefined;
    }

    return scenarios.find((scenario) => scenario.id === scenarioId) ?? scenarios[0];
};
