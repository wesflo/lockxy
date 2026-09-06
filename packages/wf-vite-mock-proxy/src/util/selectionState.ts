import { BYPASS_ALL_VALUE, updateBypassCookie, updateScenarioCookie } from '@wesflo/local-mock-api-utils';

import type {
    BypassSelection,
    CookieSelectionValues,
    MockEndpoint,
    StoredEndpointSelection,
    StoredEndpointSelections
} from '../interface.js';
import { getEndpointSelectionKey } from './settingsStorage.js';

export const createCookieSelectionValues = (
    endpoints: readonly MockEndpoint[],
    stored: StoredEndpointSelections,
    proxyOnLoad: boolean
): CookieSelectionValues => {
    let bypass = '';
    let scenarios = '';

    for (const endpoint of endpoints) {
        if (!endpoint.id) {
            continue;
        }

        const selection = stored.get(getEndpointSelectionKey(endpoint));
        if (selection?.active === false) {
            bypass = updateBypassCookie(bypass, endpoint.id, true);
        }
        if (selection?.scenarioId) {
            const selectedScenario =
                endpoint.scenarios?.find((scenario) => scenario.id === selection.scenarioId) ??
                endpoint.scenarios?.[0];
            if (selectedScenario?.id) {
                scenarios = updateScenarioCookie(scenarios, endpoint.id, selectedScenario.id);
            }
        }
    }

    return { bypass: proxyOnLoad ? bypass : BYPASS_ALL_VALUE, scenarios };
};

export const mergeStoredEndpointSelections = (
    stored: StoredEndpointSelections,
    endpoints: readonly MockEndpoint[],
    bypass: BypassSelection,
    scenarios: ReadonlyMap<string, string>
): StoredEndpointSelections => {
    const next = new Map(stored);

    for (const endpoint of endpoints) {
        if (!endpoint.id) {
            continue;
        }

        const selection: StoredEndpointSelection = {
            active: bypass.endpointIds.has(endpoint.id) ? false : undefined,
            scenarioId: scenarios.get(endpoint.id)
        };
        const key = getEndpointSelectionKey(endpoint);

        if (selection.active === undefined && selection.scenarioId === undefined) {
            next.delete(key);
        } else {
            next.set(key, selection);
        }
    }

    return next;
};
