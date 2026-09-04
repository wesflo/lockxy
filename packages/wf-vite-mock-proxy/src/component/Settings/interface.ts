export type SettingName = 'proxyOnLoad' | 'saveSelections';

export interface SettingChangeDetail {
    name: SettingName;
    checked: boolean;
}
