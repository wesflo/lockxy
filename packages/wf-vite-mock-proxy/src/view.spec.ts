// @vitest-environment happy-dom

import { render } from 'lit';
import { describe, expect, it, vi } from 'vitest';

import { ENDPOINTS_TAB, SETTINGS_TAB } from './constant.js';
import type { MockProxyViewActions, MockProxyViewModel } from './interface.js';
import { renderMockProxy } from './view.js';

const model: MockProxyViewModel = {
    activeTab: ENDPOINTS_TAB,
    bypass: { all: false, endpointIds: new Set() },
    dragging: false,
    endpoints: [{ id: 'users', method: 'GET', path: '/api/users' }],
    error: '',
    loading: false,
    open: true,
    position: { x: 24, y: 48 },
    proxyOnLoad: true,
    query: '',
    saveSelections: false,
    scenarios: new Map()
};

const createActions = (): MockProxyViewActions => ({
    closePanel: vi.fn(),
    handleEndpointChange: vi.fn(),
    handleLauncherPointerDown: vi.fn(),
    handleLauncherPointerMove: vi.fn(),
    handleLauncherPointerUp: vi.fn(),
    handleProxyChange: vi.fn(),
    handleQueryChange: vi.fn(),
    handleScenarioChange: vi.fn(),
    handleSettingChange: vi.fn(),
    handleTabKeyDown: vi.fn(),
    resetSettings: vi.fn(),
    retryManifest: vi.fn(),
    selectTab: vi.fn(),
    togglePanel: vi.fn()
});

describe('renderMockProxy', () => {
    it('renders the open panel state, position and accessible tabs', () => {
        const container = document.createElement('div');
        render(renderMockProxy(model, createActions()), container);

        const launcher = container.querySelector<HTMLButtonElement>('.launcher');
        const panel = container.querySelector<HTMLElement>('[role="dialog"]');
        const tabs = container.querySelectorAll<HTMLButtonElement>('[role="tab"]');
        expect(launcher?.getAttribute('style')).toBe('left: 24px;top: 48px');
        expect(launcher?.getAttribute('aria-expanded')).toBe('true');
        expect(panel?.getAttribute('aria-hidden')).toBe('false');
        expect(tabs[0]?.getAttribute('aria-selected')).toBe('true');
        expect(tabs[1]?.getAttribute('tabindex')).toBe('-1');
        expect(container.querySelector('wf-vite-mock-proxy-endpoints')).not.toBeNull();
    });

    it('connects launcher, close and tab controls to their actions', () => {
        const container = document.createElement('div');
        const actions = createActions();
        render(renderMockProxy(model, actions), container);

        container.querySelector<HTMLButtonElement>('.launcher')?.click();
        container.querySelector<HTMLButtonElement>('.close')?.click();
        container.querySelector<HTMLButtonElement>('#tab-settings')?.click();

        expect(actions.togglePanel).toHaveBeenCalledOnce();
        expect(actions.closePanel).toHaveBeenCalledOnce();
        expect(actions.selectTab).toHaveBeenCalledWith(SETTINGS_TAB);
    });

    it('renders settings and forwards setting events', () => {
        const container = document.createElement('div');
        const actions = createActions();
        render(renderMockProxy({ ...model, activeTab: SETTINGS_TAB }, actions), container);
        const settings = container.querySelector('wf-vite-mock-proxy-settings');

        settings?.dispatchEvent(
            new CustomEvent('onSettingChange', {
                detail: { name: 'saveSelections', checked: true }
            })
        );
        settings?.dispatchEvent(new CustomEvent('onResetSettings'));

        expect(container.querySelector('wf-vite-mock-proxy-endpoints')).toBeNull();
        expect(actions.handleSettingChange).toHaveBeenCalledWith({ name: 'saveSelections', checked: true });
        expect(actions.resetSettings).toHaveBeenCalledOnce();
    });
});
