import { SCENARIO_COOKIE_NAME, SCENARIO_ID_PATTERN } from '../../../constant.js';
import type { ScenarioSelections } from '../../../interface.js';

export const parseScenarioSelections = (cookieHeader?: string): ScenarioSelections => {
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
                SCENARIO_ID_PATTERN.test(ids[0]) &&
                SCENARIO_ID_PATTERN.test(ids[1])
            ) {
                selections.set(ids[0], ids[1]);
            }
        });
    } catch {
        return selections;
    }

    return selections;
};
