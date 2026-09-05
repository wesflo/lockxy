export interface BypassSelection {
    all: boolean;
    endpointIds: ReadonlySet<string>;
}

export interface MockManifest {
    delay?: number;
    endpoints?: MockEndpoint[];
}

export interface MockEndpoint {
    id?: string;
    label?: string;
    active?: boolean;
    method?: string;
    path: string;
    status?: number;
    file?: string;
    delay?: number;
    scenarios?: MockScenario[];
}

export interface MockScenario {
    id?: string;
    label?: string;
    status?: number;
    file?: string;
    delay?: number;
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

export interface MockProxyViewModel {
    activeTab: MockProxyTab;
    bypass: BypassSelection;
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
