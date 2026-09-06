import type { SettingsStorage } from '../interface.js';

export const removeStoredSetting = (storage: SettingsStorage, key: string): void => {
    try {
        storage.removeItem(key);
    } catch {
        // Storage can be unavailable in privacy-restricted browsing contexts.
    }
};
