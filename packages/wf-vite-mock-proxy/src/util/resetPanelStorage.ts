import {
    ENDPOINT_SELECTIONS_STORAGE_KEY,
    POSITION_STORAGE_KEY,
    PROXY_ON_LOAD_STORAGE_KEY,
    SAVE_SELECTIONS_STORAGE_KEY,
} from '../constant.js';
import type { SettingsStorage } from '../interface.js';
import { removeStoredSetting } from './removeStoredSetting.js';

export const resetPanelStorage = (storage: SettingsStorage): void => {
    [
        POSITION_STORAGE_KEY,
        PROXY_ON_LOAD_STORAGE_KEY,
        SAVE_SELECTIONS_STORAGE_KEY,
        ENDPOINT_SELECTIONS_STORAGE_KEY,
    ].forEach((key) => removeStoredSetting(storage, key));
};
