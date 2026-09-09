export interface BypassSelection {
    all: boolean;
    endpointIds: ReadonlySet<string>;
}

export interface MockManifest {
    id?: string;
    delay?: MockDelay;
    endpoints?: MockEndpoint[];
}

export type MockDelay = number | readonly [number, number];

export interface MockEndpoint {
    id?: string;
    label?: string;
    active?: boolean;
    method?: string;
    path: string;
    status?: number;
    file?: string;
    delay?: MockDelay;
    scenarios?: MockScenario[];
}

export interface MockScenario {
    id?: string;
    label?: string;
    status?: number;
    file?: string;
    delay?: MockDelay;
}

export interface EndpointViewState {
    bypass: BypassSelection;
    scenarios: ReadonlyMap<string, string>;
}

export type MockProxyTab = 'endpoints' | 'settings';

export interface Position {
    x: number;
    y: number;
}

export interface DragState {
    offsetX: number;
    offsetY: number;
}

export interface Viewport {
    width: number;
    height: number;
}

export interface PositionStorage {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
}

export interface SettingsStorage extends PositionStorage {
    readonly length?: number;
    key?(index: number): string | null;
    removeItem(key: string): void;
}

export interface StoredEndpointSelection {
    active?: boolean;
    scenarioId?: string;
}

export type StoredEndpointSelections = ReadonlyMap<string, StoredEndpointSelection>;

export interface CookieSelectionValues {
    bypass: string;
    scenarios: string;
}

export interface PanelSettings {
    proxyOnLoad: boolean;
    saveSelections: boolean;
}

export interface MockProxyViewModel {
    activeTab: MockProxyTab;
    bypass: BypassSelection;
    canSaveSelections: boolean;
    dragging: boolean;
    endpoints: readonly MockEndpoint[];
    error: string;
    loading: boolean;
    open: boolean;
    position: Position;
    proxyOnLoad: boolean;
    query: string;
    saveSelections: boolean;
    scenarios: ReadonlyMap<string, string>;
}

export interface MockProxyViewActions {
    closePanel(): void;
    handleEndpointChange(endpoint: MockEndpoint, active: boolean): void;
    handleLauncherPointerDown(event: PointerEvent): void;
    handleLauncherPointerMove(event: PointerEvent): void;
    handleLauncherPointerUp(): void;
    handleProxyChange(active: boolean): void;
    handleQueryChange(query: string): void;
    handleScenarioChange(endpoint: MockEndpoint, scenarioId: string): void;
    handleSettingChange(detail: SettingChangeDetail): void;
    handleTabKeyDown(event: KeyboardEvent): void;
    resetSettings(): void;
    retryManifest(): void;
    selectTab(tab: MockProxyTab): void;
    togglePanel(): void;
}
import type { SettingChangeDetail } from './component/Settings/interface.js';
