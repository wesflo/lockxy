import type { SettingsStorage, StoredEndpointSelections } from '../interface.js';

export const persistEndpointSelections = (
    storage: SettingsStorage,
    key: string,
    selections: StoredEndpointSelections
): void => {
    try {
        storage.setItem(key, JSON.stringify([...selections]));
    } catch {
        // Storage can be unavailable in privacy-restricted browsing contexts.
    }
};
