import { PROXY_ON_LOAD_STORAGE_KEY, SAVE_SELECTIONS_STORAGE_KEY } from '../constant.js';
import type { PanelSettings, SettingsStorage } from '../interface.js';
import { getManifestStorageKey } from './getManifestStorageKey.js';
import { restoreBooleanSetting } from './restoreBooleanSetting.js';

export const restorePanelSettings = (storage: SettingsStorage, manifestId?: string): PanelSettings => ({
    proxyOnLoad: restoreBooleanSetting(storage, PROXY_ON_LOAD_STORAGE_KEY, true),
    saveSelections: manifestId
        ? restoreBooleanSetting(storage, getManifestStorageKey(SAVE_SELECTIONS_STORAGE_KEY, manifestId), false)
        : false,
});
