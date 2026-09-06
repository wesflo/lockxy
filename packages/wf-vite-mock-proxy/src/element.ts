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
    SAVE_SELECTIONS_STORAGE_KEY
} from './constant.js';
import type { MockEndpoint, MockManifest } from './interface.js';
import './component/Endpoints/element.js';
import { MockProxyInteractionElement } from './component/MockProxyInteraction/element.js';
import type { SettingChangeDetail } from './component/Settings/interface.js';
import './component/Settings/element.js';
import { mockProxyStyle } from './style.js';
import { createCookieSelectionValues } from './util/createCookieSelectionValues.js';
import { mergeStoredEndpointSelections } from './util/mergeStoredEndpointSelections.js';
import { persistBooleanSetting } from './util/persistBooleanSetting.js';
import { persistEndpointSelections } from './util/persistEndpointSelections.js';
import { removeStoredSetting } from './util/removeStoredSetting.js';
import { resetPanelStorage } from './util/resetPanelStorage.js';
import { restoreEndpointSelections } from './util/restoreEndpointSelections.js';
import { restorePanelSettings } from './util/restorePanelSettings.js';
import { renderMockProxy } from './view.js';
import {nothing} from "lit";

@wfElement(MOCK_PROXY_TAG_NAME)
export class WfViteMockProxy extends MockProxyInteractionElement {
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
        setCookieValue(SCENARIO_COOKIE_NAME, '');
        setCookieValue(BYPASS_COOKIE_NAME, this.proxyOnLoad ? '' : BYPASS_ALL_VALUE);
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

            this.manifest = (await response.json()) as MockManifest;
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

    private syncCookieState = (): void => {
        this.bypass = parseBypassCookie(getCookieValue(BYPASS_COOKIE_NAME));
        this.scenarios = parseScenarioCookie(getCookieValue(SCENARIO_COOKIE_NAME));
    };

    private applyStoredSelections = (): void => {
        const stored = restoreEndpointSelections(localStorage, ENDPOINT_SELECTIONS_STORAGE_KEY);
        const values = createCookieSelectionValues(this.manifest?.endpoints ?? [], stored, this.proxyOnLoad);
        setCookieValue(BYPASS_COOKIE_NAME, values.bypass);
        setCookieValue(SCENARIO_COOKIE_NAME, values.scenarios);
        this.syncCookieState();
    };

    private persistSelections = (endpoints: readonly MockEndpoint[]): void => {
        if (!this.saveSelections) {
            return;
        }

        const current = restoreEndpointSelections(localStorage, ENDPOINT_SELECTIONS_STORAGE_KEY);
        const selections = mergeStoredEndpointSelections(current, endpoints, this.bypass, this.scenarios);
        persistEndpointSelections(localStorage, ENDPOINT_SELECTIONS_STORAGE_KEY, selections);
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
            this.saveSelections = checked;
            persistBooleanSetting(localStorage, SAVE_SELECTIONS_STORAGE_KEY, checked);
            if (checked) {
                this.persistSelections(this.manifest?.endpoints ?? []);
            } else {
                removeStoredSetting(localStorage, ENDPOINT_SELECTIONS_STORAGE_KEY);
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
        this.manifest ?
        renderMockProxy(
            {
                activeTab: this.activeTab,
                bypass: this.bypass,
                dragging: Boolean(this.dragState),
                endpoints: this.manifest?.endpoints ?? [],
                error: this.error,
                loading: this.loading,
                open: this.open,
                position: this.position,
                proxyOnLoad: this.proxyOnLoad,
                query: this.query,
                saveSelections: this.saveSelections,
                scenarios: this.scenarios
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
                togglePanel: this.togglePanel
            }
        ) : nothing;
}
