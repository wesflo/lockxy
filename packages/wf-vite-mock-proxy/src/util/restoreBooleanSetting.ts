import type { SettingsStorage } from '../interface.js';

export const restoreBooleanSetting = (storage: SettingsStorage, key: string, fallback: boolean): boolean => {
    try {
        const value = storage.getItem(key);
        return value === 'true' ? true : value === 'false' ? false : fallback;
    } catch {
        return fallback;
    }
};
