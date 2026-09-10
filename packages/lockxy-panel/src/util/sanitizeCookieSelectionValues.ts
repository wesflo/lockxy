import { BYPASS_ALL_VALUE, parseBypassCookie, parseScenarioCookie } from '@wesflo/local-mock-api-utils';

import type { CookieSelectionValues, MockEndpoint } from '../interface.js';

export const sanitizeCookieSelectionValues = (
    endpoints: readonly MockEndpoint[],
    bypassValue?: string,
    scenarioValue?: string
): CookieSelectionValues => {
    const endpointsById = new Map(endpoints.filter(({ id }) => id).map((endpoint) => [endpoint.id!, endpoint]));
    const bypass = parseBypassCookie(bypassValue);
    const scenarios = parseScenarioCookie(scenarioValue);

    const sanitizedBypass = bypass.all
        ? BYPASS_ALL_VALUE
        : [...bypass.endpointIds].filter((endpointId) => endpointsById.has(endpointId)).join('|');
    const sanitizedScenarios = [...scenarios]
        .flatMap(([endpointId, scenarioId]) => {
            const endpoint = endpointsById.get(endpointId);
            const selectedScenario =
                endpoint?.scenarios?.find((scenario) => scenario.id === scenarioId) ?? endpoint?.scenarios?.[0];

            return selectedScenario?.id ? [`${endpointId}:${selectedScenario.id}`] : [];
        })
        .join('|');

    return { bypass: sanitizedBypass, scenarios: sanitizedScenarios };
};
