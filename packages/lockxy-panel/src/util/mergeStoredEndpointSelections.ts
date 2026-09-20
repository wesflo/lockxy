import type { BypassSelection, MockEndpoint } from '@wesflo/local-mock-api-utils';
import type { StoredEndpointSelection, StoredEndpointSelections } from '../interface.js';
import { getEndpointSelectionKey } from './getEndpointSelectionKey.js';

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
            scenarioId: scenarios.get(endpoint.id),
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
