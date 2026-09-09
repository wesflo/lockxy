import {
    ENDPOINT_SELECTIONS_STORAGE_KEY,
    POSITION_STORAGE_KEY,
    PROXY_ON_LOAD_STORAGE_KEY,
    SAVE_SELECTIONS_STORAGE_KEY,
} from '../constant.js';
import type { SettingsStorage } from '../interface.js';
import { removeStoredSetting } from './removeStoredSetting.js';

export const resetPanelStorage = (storage: SettingsStorage): void => {
    const exactKeys = [
        POSITION_STORAGE_KEY,
        PROXY_ON_LOAD_STORAGE_KEY,
        SAVE_SELECTIONS_STORAGE_KEY,
        ENDPOINT_SELECTIONS_STORAGE_KEY,
    ];
    const scopedPrefixes = [`${SAVE_SELECTIONS_STORAGE_KEY}:`, `${ENDPOINT_SELECTIONS_STORAGE_KEY}:`];
    const scopedKeys = Array.from({ length: storage.length ?? 0 }, (_, index) => storage.key?.(index)).filter(
        (key): key is string => Boolean(key) && scopedPrefixes.some((prefix) => key!.startsWith(prefix))
    );

    [...exactKeys, ...scopedKeys].forEach((key) => removeStoredSetting(storage, key));
};
