import { parseScenarioCookie } from './parseScenarioCookie';

export const updateScenarioCookie = (value: string | undefined, endpointId: string, scenarioId?: string): string => {
    const selections = parseScenarioCookie(value);

    if (scenarioId) {
        selections.set(endpointId, scenarioId);
    } else {
        selections.delete(endpointId);
    }

    return [...selections].map(([id, selection]) => `${id}:${selection}`).join('|');
};
