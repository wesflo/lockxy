import { BYPASS_ALL_VALUE, updateBypassCookie, updateScenarioCookie } from '@wesflo/local-mock-api-utils';

import type { CookieSelectionValues, MockEndpoint, StoredEndpointSelections } from '../interface.js';
import { getEndpointSelectionKey } from './getEndpointSelectionKey.js';

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
