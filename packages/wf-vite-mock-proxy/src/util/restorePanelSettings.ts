import { PROXY_ON_LOAD_STORAGE_KEY, SAVE_SELECTIONS_STORAGE_KEY } from '../constant.js';
import type { PanelSettings, SettingsStorage } from '../interface.js';
import { restoreBooleanSetting } from './restoreBooleanSetting.js';

export const restorePanelSettings = (storage: SettingsStorage): PanelSettings => ({
    proxyOnLoad: restoreBooleanSetting(storage, PROXY_ON_LOAD_STORAGE_KEY, true),
    saveSelections: restoreBooleanSetting(storage, SAVE_SELECTIONS_STORAGE_KEY, false),
});
