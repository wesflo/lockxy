import {
    BYPASS_ALL_VALUE,
    BYPASS_COOKIE_NAME,
    getCookieValue,
    MANIFEST_ROUTE,
    parseBypassCookie,
    parseScenarioCookie,
    SCENARIO_COOKIE_NAME,
    setCookieValue,
    updateBypassCookie,
    updateScenarioCookie,
} from '@wesflo/local-mock-api-utils';
import { resetStyles, wfElement } from '@wesflo/local-mock-api-ui';
import { state } from 'lit/decorators.js';

import {
    ENDPOINT_SELECTIONS_STORAGE_KEY,
    MOCK_PROXY_TAG_NAME,
    PROXY_ON_LOAD_STORAGE_KEY,
    SAVE_SELECTIONS_STORAGE_KEY,
} from './constant.js';
import type { MockEndpoint, MockManifest } from './interface.js';
import './component/Endpoints/element.js';
import { MockProxyInteractionElement } from './component/MockProxyInteraction/element.js';
import type { SettingChangeDetail } from './component/Settings/interface.js';
import './component/Settings/element.js';
import { mockProxyStyle } from './style.js';
import { createCookieSelectionValues } from './util/createCookieSelectionValues.js';
import { getManifestStorageKey } from './util/getManifestStorageKey.js';
import { mergeStoredEndpointSelections } from './util/mergeStoredEndpointSelections.js';
import { persistBooleanSetting } from './util/persistBooleanSetting.js';
import { persistEndpointSelections } from './util/persistEndpointSelections.js';
import { removeStoredSetting } from './util/removeStoredSetting.js';
import { resetPanelStorage } from './util/resetPanelStorage.js';
import { restoreEndpointSelections } from './util/restoreEndpointSelections.js';
import { restorePanelSettings } from './util/restorePanelSettings.js';
import { sanitizeCookieSelectionValues } from './util/sanitizeCookieSelectionValues.js';
import { renderMockProxy } from './view.js';
import { nothing } from 'lit';

@wfElement(MOCK_PROXY_TAG_NAME)
export class WfLockxyPanel extends MockProxyInteractionElement {
    static styles = [resetStyles, mockProxyStyle];

    @state() private bypass = parseBypassCookie();
    @state() private error = '';
    @state() private loading = true;
    @state() private manifest?: MockManifest;
    @state() private proxyOnLoad = true;
    @state() private query = '';
    @state() private saveSelections = false;
    @state() private scenarios = new Map<string, string>();

    connectedCallback(): void {
        super.connectedCallback();
        const settings = restorePanelSettings(localStorage);
        this.proxyOnLoad = settings.proxyOnLoad;
        this.saveSelections = settings.saveSelections;
        if (getCookieValue(BYPASS_COOKIE_NAME) === undefined && !this.proxyOnLoad) {
            setCookieValue(BYPASS_COOKIE_NAME, BYPASS_ALL_VALUE);
        }
        this.syncCookieState();
        void this.loadManifest();
    }

    private loadManifest = async (): Promise<void> => {
        this.error = '';
        this.loading = true;

        try {
            const response = await fetch(MANIFEST_ROUTE, { headers: { accept: 'application/json' } });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const manifest = (await response.json()) as MockManifest;
            this.manifest = manifest.endpoints?.length ? manifest : undefined;
            this.saveSelections = restorePanelSettings(localStorage, this.manifest?.id).saveSelections;
            this.sanitizeCookieState();
            if (this.saveSelections) {
                this.applyStoredSelections();
            }
        } catch (error) {
            this.manifest = undefined;
            this.error = `The manifest could not be loaded (${error instanceof Error ? error.message : String(error)}).`;
        } finally {
            this.loading = false;
        }
    };

    private sanitizeCookieState = (): void => {
        const bypassCookie = getCookieValue(BYPASS_COOKIE_NAME);
        const scenarioCookie = getCookieValue(SCENARIO_COOKIE_NAME);
        const sanitized = sanitizeCookieSelectionValues(this.manifest?.endpoints ?? [], bypassCookie, scenarioCookie);

        if ((bypassCookie ?? '') !== sanitized.bypass) {
            setCookieValue(BYPASS_COOKIE_NAME, sanitized.bypass);
        }
        if ((scenarioCookie ?? '') !== sanitized.scenarios) {
            setCookieValue(SCENARIO_COOKIE_NAME, sanitized.scenarios);
        }
        this.syncCookieState();
    };

    private syncCookieState = (): void => {
        this.bypass = parseBypassCookie(getCookieValue(BYPASS_COOKIE_NAME));
        this.scenarios = parseScenarioCookie(getCookieValue(SCENARIO_COOKIE_NAME));
    };

    private applyStoredSelections = (): void => {
        if (!this.manifest?.id) {
            return;
        }

        const storageKey = getManifestStorageKey(ENDPOINT_SELECTIONS_STORAGE_KEY, this.manifest.id);
        const stored = restoreEndpointSelections(localStorage, storageKey);
        const values = createCookieSelectionValues(this.manifest.endpoints ?? [], stored, !this.bypass.all);
        setCookieValue(BYPASS_COOKIE_NAME, values.bypass);
        setCookieValue(SCENARIO_COOKIE_NAME, values.scenarios);
        this.syncCookieState();
    };

    private persistSelections = (endpoints: readonly MockEndpoint[]): void => {
        if (!this.saveSelections || !this.manifest?.id) {
            return;
        }

        const storageKey = getManifestStorageKey(ENDPOINT_SELECTIONS_STORAGE_KEY, this.manifest.id);
        const current = restoreEndpointSelections(localStorage, storageKey);
        const selections = mergeStoredEndpointSelections(current, endpoints, this.bypass, this.scenarios);
        persistEndpointSelections(localStorage, storageKey, selections);
    };

    private setProxyActive = (active: boolean): void => {
        setCookieValue(BYPASS_COOKIE_NAME, active ? '' : BYPASS_ALL_VALUE);
        this.syncCookieState();
    };

    private setEndpointActive = (endpoint: MockEndpoint, active: boolean): void => {
        if (!endpoint.id) {
            return;
        }

        setCookieValue(
            BYPASS_COOKIE_NAME,
            updateBypassCookie(getCookieValue(BYPASS_COOKIE_NAME), endpoint.id, !active)
        );
        this.syncCookieState();
        this.persistSelections([endpoint]);
    };

    private setScenario = (endpoint: MockEndpoint, scenarioId: string): void => {
        if (!endpoint.id) {
            return;
        }

        setCookieValue(
            SCENARIO_COOKIE_NAME,
            updateScenarioCookie(getCookieValue(SCENARIO_COOKIE_NAME), endpoint.id, scenarioId || undefined)
        );
        this.syncCookieState();
        this.persistSelections([endpoint]);
    };

    private setSetting = ({ name, checked }: SettingChangeDetail): void => {
        if (name === 'proxyOnLoad') {
            this.proxyOnLoad = checked;
            persistBooleanSetting(localStorage, PROXY_ON_LOAD_STORAGE_KEY, checked);
            this.setProxyActive(checked);
            if (checked && this.saveSelections) {
                this.applyStoredSelections();
            }
        } else {
            if (!this.manifest?.id) {
                return;
            }

            this.saveSelections = checked;
            const saveKey = getManifestStorageKey(SAVE_SELECTIONS_STORAGE_KEY, this.manifest.id);
            const selectionsKey = getManifestStorageKey(ENDPOINT_SELECTIONS_STORAGE_KEY, this.manifest.id);
            persistBooleanSetting(localStorage, saveKey, checked);
            if (checked) {
                this.persistSelections(this.manifest?.endpoints ?? []);
            } else {
                removeStoredSetting(localStorage, selectionsKey);
            }
        }
    };

    private resetSettings = (): void => {
        setCookieValue(BYPASS_COOKIE_NAME, '');
        setCookieValue(SCENARIO_COOKIE_NAME, '');
        this.proxyOnLoad = true;
        this.saveSelections = false;
        this.position = this.defaultPosition();

        resetPanelStorage(localStorage);

        this.syncCookieState();
    };

    render = () =>
        this.manifest
            ? renderMockProxy(
                  {
                      activeTab: this.activeTab,
                      bypass: this.bypass,
                      canSaveSelections: Boolean(this.manifest.id),
                      dragging: Boolean(this.dragState),
                      endpoints: this.manifest?.endpoints ?? [],
                      error: this.error,
                      loading: this.loading,
                      open: this.open,
                      position: this.position,
                      proxyOnLoad: this.proxyOnLoad,
                      query: this.query,
                      saveSelections: this.saveSelections,
                      scenarios: this.scenarios,
                  },
                  {
                      closePanel: this.closePanel,
                      handleEndpointChange: this.setEndpointActive,
                      handleLauncherPointerDown: this.handleLauncherPointerDown,
                      handleLauncherPointerMove: this.handleLauncherPointerMove,
                      handleLauncherPointerUp: this.handleLauncherPointerUp,
                      handleProxyChange: this.setProxyActive,
                      handleQueryChange: (query) => (this.query = query),
                      handleScenarioChange: this.setScenario,
                      handleSettingChange: this.setSetting,
                      handleTabKeyDown: this.handleTabKeyDown,
                      resetSettings: this.resetSettings,
                      retryManifest: () => void this.loadManifest(),
                      selectTab: this.selectTab,
                      togglePanel: this.togglePanel,
                  }
              )
            : nothing;
}
