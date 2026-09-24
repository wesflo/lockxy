import type { MockEndpoint, MockScenario, ScenarioSelections } from '../../../runtimeInterface.js';

export const findSelectedScenario = (
    endpoint: MockEndpoint,
    selections: ScenarioSelections
): MockScenario | undefined => {
    const scenarios = endpoint.scenarios ?? [];

    if (scenarios.length === 0) {
        return undefined;
    }

    let manifestControlsScenario = false;
    for (const scenario of scenarios) {
        if (scenario.active === true) {
            return scenario;
        }
        if (scenario.active === false) {
            manifestControlsScenario = true;
        }
    }

    if (manifestControlsScenario) {
        return undefined;
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
