import type {
    MockEndpoint,
    PanelSettings,
    SettingsStorage,
    StoredEndpointSelection,
    StoredEndpointSelections
} from '../interface.js';
import {
    ENDPOINT_SELECTIONS_STORAGE_KEY,
    POSITION_STORAGE_KEY,
    PROXY_ON_LOAD_STORAGE_KEY,
    SAVE_SELECTIONS_STORAGE_KEY
} from '../constant.js';

export const getEndpointSelectionKey = (endpoint: MockEndpoint): string =>
    `${endpoint.method?.toUpperCase() ?? '*'} ${endpoint.path}`;

export const restoreBooleanSetting = (
    storage: SettingsStorage,
    key: string,
    fallback: boolean
): boolean => {
    try {
        const value = storage.getItem(key);
        return value === 'true' ? true : value === 'false' ? false : fallback;
    } catch {
        return fallback;
    }
};

export const persistBooleanSetting = (storage: SettingsStorage, key: string, value: boolean): void => {
    try {
        storage.setItem(key, String(value));
    } catch {
        // Storage can be unavailable in privacy-restricted browsing contexts.
    }
};

export const restoreEndpointSelections = (
    storage: SettingsStorage,
    key: string
): StoredEndpointSelections => {
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

export const removeStoredSetting = (storage: SettingsStorage, key: string): void => {
    try {
        storage.removeItem(key);
    } catch {
        // Storage can be unavailable in privacy-restricted browsing contexts.
    }
};

export const restorePanelSettings = (storage: SettingsStorage): PanelSettings => ({
    proxyOnLoad: restoreBooleanSetting(storage, PROXY_ON_LOAD_STORAGE_KEY, true),
    saveSelections: restoreBooleanSetting(storage, SAVE_SELECTIONS_STORAGE_KEY, false)
});

export const resetPanelStorage = (storage: SettingsStorage): void => {
    [
        POSITION_STORAGE_KEY,
        PROXY_ON_LOAD_STORAGE_KEY,
        SAVE_SELECTIONS_STORAGE_KEY,
        ENDPOINT_SELECTIONS_STORAGE_KEY
    ].forEach((key) => removeStoredSetting(storage, key));
};
