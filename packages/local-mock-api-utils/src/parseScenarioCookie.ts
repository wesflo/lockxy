const SCENARIO_ID_PATTERN = /^[A-Za-z0-9_-]+$/;

export const parseScenarioCookie = (value?: string): Map<string, string> => {
    const selections = new Map<string, string>();

    value?.split('|').forEach((entry) => {
        const parts = entry.split(':');
        const endpointId = parts[0];
        const scenarioId = parts[1];

        if (
            parts.length === 2 &&
            endpointId &&
            scenarioId &&
            SCENARIO_ID_PATTERN.test(endpointId) &&
            SCENARIO_ID_PATTERN.test(scenarioId)
        ) {
            selections.set(endpointId, scenarioId);
        }
    });

    return selections;
};
