import type { MockEndpoint, MockScenario, ScenarioSelections } from '../../../interface.js';

export const findSelectedScenario = (
    endpoint: MockEndpoint,
    selections: ScenarioSelections
): MockScenario | undefined => {
    const scenarios = endpoint.scenarios ?? [];

    if (scenarios.length === 0) {
        return undefined;
    }

    if (scenarios.some((scenario) => scenario.active !== undefined)) {
        return scenarios.find((scenario) => scenario.active === true);
    }

    if (!endpoint.id || !selections.has(endpoint.id)) {
        return scenarios[0];
    }

    const scenarioId = selections.get(endpoint.id);

    if (scenarioId === '') {
        return undefined;
    }

    return scenarios.find((scenario) => scenario.id === scenarioId) ?? scenarios[0];
};
