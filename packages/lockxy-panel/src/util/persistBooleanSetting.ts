import type { SettingsStorage } from '../interface.js';

export const persistBooleanSetting = (storage: SettingsStorage, key: string, value: boolean): void => {
    try {
        storage.setItem(key, String(value));
    } catch {
        // Storage can be unavailable in privacy-restricted browsing contexts.
    }
};
