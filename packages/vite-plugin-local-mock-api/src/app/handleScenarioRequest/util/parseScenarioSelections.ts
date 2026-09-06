import { ENDPOINT_ID_PATTERN, SCENARIO_COOKIE_NAME } from '@wesflo/local-mock-api-utils';
import type { ScenarioSelections } from '../../../interface.js';

export const parseScenarioSelections = (cookieHeader?: string, onError?: (message: string) => void): ScenarioSelections => {
    const selections = new Map<string, string>();

    if (!cookieHeader) {
        return selections;
    }

    const cookiePrefix = `${SCENARIO_COOKIE_NAME}=`;
    const cookie = cookieHeader
        .split(';')
        .map((part) => part.trim())
        .find((part) => part.startsWith(cookiePrefix));

    if (!cookie) {
        return selections;
    }

    try {
        const value = decodeURIComponent(cookie.slice(cookiePrefix.length));

        value.split('|').forEach((entry) => {
            const ids = entry.split(':');

            if (
                ids.length === 2 &&
                ids[0] &&
                ids[1] &&
                ENDPOINT_ID_PATTERN.test(ids[0]) &&
                ENDPOINT_ID_PATTERN.test(ids[1])
            ) {
                selections.set(ids[0], ids[1]);
            } else if (entry) {
                onError?.('Ignoring a malformed scenario selection cookie entry.');
            }
        });
    } catch {
        onError?.('Ignoring a scenario selection cookie that cannot be decoded.');
        return selections;
    }

    return selections;
};
