import { BYPASS_ALL_VALUE, BYPASS_COOKIE_NAME, SCENARIO_ID_PATTERN } from '../constant.js';
import type { BypassSelections } from '../interface.js';

export const parseBypassSelections = (cookieHeader?: string): BypassSelections => {
    const endpointIds = new Set<string>();

    if (!cookieHeader) {
        return { all: false, endpointIds };
    }

    const cookiePrefix = `${BYPASS_COOKIE_NAME}=`;
    const cookie = cookieHeader
        .split(';')
        .map((part) => part.trim())
        .find((part) => part.startsWith(cookiePrefix));

    if (!cookie) {
        return { all: false, endpointIds };
    }

    try {
        const value = decodeURIComponent(cookie.slice(cookiePrefix.length));

        if (value === BYPASS_ALL_VALUE) {
            return { all: true, endpointIds };
        }

        value.split('|').forEach((endpointId) => {
            if (SCENARIO_ID_PATTERN.test(endpointId)) {
                endpointIds.add(endpointId);
            }
        });
    } catch {
        return { all: false, endpointIds };
    }

    return { all: false, endpointIds };
};
