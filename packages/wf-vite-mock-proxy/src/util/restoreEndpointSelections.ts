import type { SettingsStorage, StoredEndpointSelection, StoredEndpointSelections } from '../interface.js';

export const restoreEndpointSelections = (storage: SettingsStorage, key: string): StoredEndpointSelections => {
    try {
        const value = storage.getItem(key);
        if (!value) {
            return new Map();
        }

        const parsed = JSON.parse(value) as unknown;
        if (!Array.isArray(parsed)) {
            return new Map();
        }

        return new Map(
            parsed.filter(
                (entry): entry is [string, StoredEndpointSelection] =>
                    Array.isArray(entry) &&
                    entry.length === 2 &&
                    typeof entry[0] === 'string' &&
                    Boolean(entry[1]) &&
                    typeof entry[1] === 'object' &&
                    !Array.isArray(entry[1]) &&
                    (entry[1].active === undefined || typeof entry[1].active === 'boolean') &&
                    (entry[1].scenarioId === undefined || typeof entry[1].scenarioId === 'string')
            )
        );
    } catch {
        return new Map();
    }
};
