// @vitest-environment happy-dom

import {
    BYPASS_COOKIE_NAME,
    DEVELOPMENT_HEADER_NAME,
    DEVELOPMENT_HEADER_VALUE,
    getCookieValue,
    MANIFEST_ROUTE,
    SCENARIO_COOKIE_NAME
} from '@wesflo/local-mock-api-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { WfSwitch } from '@wesflo/local-mock-api-ui';

import type { MockProxyEndpoints } from './component/Endpoints/element.js';
import type { MockProxySettings } from './component/Settings/element.js';
import {
    ENDPOINT_SELECTIONS_STORAGE_KEY,
    POSITION_STORAGE_KEY,
    PROXY_ON_LOAD_STORAGE_KEY,
    SAVE_SELECTIONS_STORAGE_KEY
} from './constant.js';
import './element.js';
import type { WfViteMockProxy } from './element.js';

const manifest = {
    endpoints: [
        {
            id: 'orders',
            method: 'GET',
            path: '/api/orders',
            scenarios: [
                { id: 'success', label: 'Success' },
                { id: 'error', label: '500 Server Error' },
            ],
        },
    ],
};

const createElement = async (): Promise<WfViteMockProxy> => {
    const element = document.createElement('wf-vite-mock-proxy') as WfViteMockProxy;
    document.body.append(element);
    await element.updateComplete;
    await vi.waitFor(async () => {
        const endpoints = element.shadowRoot?.querySelector<MockProxyEndpoints>('wf-vite-mock-proxy-endpoints');
        await endpoints?.updateComplete;
        expect(endpoints?.shadowRoot?.querySelector('.endpoint')).not.toBeNull();
    });
    return element;
};

const getEndpoints = (element: WfViteMockProxy): MockProxyEndpoints =>
    element.shadowRoot?.querySelector<MockProxyEndpoints>('wf-vite-mock-proxy-endpoints') as MockProxyEndpoints;

const getSettings = async (element: WfViteMockProxy): Promise<MockProxySettings> => {
    element.shadowRoot?.querySelector<HTMLButtonElement>('#tab-settings')?.click();
    await element.updateComplete;
    const settings = element.shadowRoot?.querySelector<MockProxySettings>('wf-vite-mock-proxy-settings') as MockProxySettings;
    await settings.updateComplete;
    return settings;
};

const clickSwitch = async (element: WfSwitch): Promise<void> => {
    element.shadowRoot?.querySelector<HTMLInputElement>('input')?.click();
    await element.updateComplete;
};

describe('wf-vite-mock-proxy', () => {
    beforeEach(() => {
        document.body.replaceChildren();
        document.cookie = `${BYPASS_COOKIE_NAME}=; Max-Age=0; Path=/`;
        document.cookie = `${SCENARIO_COOKIE_NAME}=; Max-Age=0; Path=/`;
        localStorage.clear();
        vi.stubGlobal(
            'fetch',
            vi.fn().mockImplementation(async () =>
                new Response(JSON.stringify(manifest), {
                    status: 200,
                    headers: {
                        'content-type': 'application/json',
                        [DEVELOPMENT_HEADER_NAME]: DEVELOPMENT_HEADER_VALUE
                    },
                })
            )
        );
    });

    it('loads the fixed manifest route and opens and closes accessibly', async () => {
        const element = await createElement();
        const launcher = element.shadowRoot?.querySelector<HTMLButtonElement>('.launcher');

        expect(fetch).toHaveBeenCalledWith(MANIFEST_ROUTE, { headers: { accept: 'application/json' } });
        launcher?.click();
        await element.updateComplete;

        const panel = element.shadowRoot?.querySelector<HTMLElement>('[role="dialog"]');
        expect(panel?.getAttribute('aria-hidden')).toBe('false');
        expect(element.shadowRoot?.activeElement).toBe(element.shadowRoot?.querySelector('.close'));

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        await element.updateComplete;

        expect(panel?.getAttribute('aria-hidden')).toBe('true');
        expect(element.shadowRoot?.activeElement).toBe(launcher);
    });

    it('starts with an active proxy and no persisted selections by default', async () => {
        document.cookie = `${BYPASS_COOKIE_NAME}=${encodeURIComponent('*')}; Path=/`;
        document.cookie = `${SCENARIO_COOKIE_NAME}=orders%3Aerror; Path=/`;

        await createElement();

        expect(getCookieValue(BYPASS_COOKIE_NAME)).toBe('');
        expect(getCookieValue(SCENARIO_COOKIE_NAME)).toBe('');
    });

    it('stays disabled and warns without the development server marker', async () => {
        vi.mocked(fetch).mockResolvedValue(new Response('{}', { status: 200 }));
        const element = document.createElement('wf-vite-mock-proxy') as WfViteMockProxy;

        document.body.append(element);
        await vi.waitFor(() => expect(fetch).toHaveBeenCalled());
        await element.updateComplete;

        expect(element.shadowRoot?.querySelector('.launcher')).toBeNull();
    });

    it('writes global, endpoint and scenario choices to cookies', async () => {
        const element = await createElement();
        const endpoints = getEndpoints(element);
        const switches = endpoints.shadowRoot?.querySelectorAll<WfSwitch>('wf-switch');

        await clickSwitch(switches![0]);
        expect(getCookieValue(BYPASS_COOKIE_NAME)).toBe('*');

        await clickSwitch(switches![0]);
        await element.updateComplete;
        await clickSwitch(switches![1]);
        expect(getCookieValue(BYPASS_COOKIE_NAME)).toBe('orders');

        const scenario = endpoints.shadowRoot?.querySelector<HTMLSelectElement>('.endpoint select');
        scenario!.value = 'error';
        scenario?.dispatchEvent(new Event('change'));
        expect(getCookieValue(SCENARIO_COOKIE_NAME)).toBe('orders:error');
    });

    it('renders the settings as a separate component', async () => {
        const element = await createElement();

        element.shadowRoot?.querySelector<HTMLButtonElement>('#tab-settings')?.click();
        await element.updateComplete;

        expect(element.shadowRoot?.querySelector('wf-vite-mock-proxy-settings')).not.toBeNull();
        expect(element.shadowRoot?.querySelector('wf-vite-mock-proxy-endpoints')).toBeNull();
    });

    it('persists the proxy-on-load setting and applies it on the next mount', async () => {
        const element = await createElement();
        const settings = await getSettings(element);
        const proxyOnLoad = settings.shadowRoot?.querySelector<WfSwitch>('wf-switch');

        await clickSwitch(proxyOnLoad!);

        expect(localStorage.getItem(PROXY_ON_LOAD_STORAGE_KEY)).toBe('false');
        expect(getCookieValue(BYPASS_COOKIE_NAME)).toBe('*');

        element.remove();
        const reloaded = await createElement();
        const reloadedSettings = await getSettings(reloaded);

        expect(reloadedSettings.proxyOnLoad).toBe(false);
        expect(getCookieValue(BYPASS_COOKIE_NAME)).toBe('*');
    });

    it('stores selections by method and path and restores them for a changed endpoint ID', async () => {
        const element = await createElement();
        const settings = await getSettings(element);
        const settingSwitches = settings.shadowRoot?.querySelectorAll<WfSwitch>('wf-switch');
        await clickSwitch(settingSwitches![1]);

        element.shadowRoot?.querySelector<HTMLButtonElement>('#tab-endpoints')?.click();
        await element.updateComplete;
        const endpoints = getEndpoints(element);
        await endpoints.updateComplete;
        const scenario = endpoints.shadowRoot?.querySelector<HTMLSelectElement>('.endpoint select');
        scenario!.value = 'error';
        scenario?.dispatchEvent(new Event('change'));
        await element.updateComplete;
        const endpointSwitch = endpoints.shadowRoot?.querySelectorAll<WfSwitch>('wf-switch')[1];
        await clickSwitch(endpointSwitch!);

        expect(localStorage.getItem(SAVE_SELECTIONS_STORAGE_KEY)).toBe('true');
        expect(JSON.parse(localStorage.getItem(ENDPOINT_SELECTIONS_STORAGE_KEY) ?? '')).toEqual([
            ['GET /api/orders', { active: false, scenarioId: 'error' }]
        ]);

        element.remove();
        vi.mocked(fetch).mockImplementation(async () =>
            new Response(JSON.stringify({
                endpoints: [{ ...manifest.endpoints[0], id: 'orders-v2' }]
            }), {
                status: 200,
                headers: {
                    'content-type': 'application/json',
                    [DEVELOPMENT_HEADER_NAME]: DEVELOPMENT_HEADER_VALUE
                }
            })
        );
        await createElement();

        expect(getCookieValue(BYPASS_COOKIE_NAME)).toBe('orders-v2');
        expect(getCookieValue(SCENARIO_COOKIE_NAME)).toBe('orders-v2:error');
    });

    it('falls back to the first scenario when a stored scenario no longer exists', async () => {
        localStorage.setItem(SAVE_SELECTIONS_STORAGE_KEY, 'true');
        localStorage.setItem(
            ENDPOINT_SELECTIONS_STORAGE_KEY,
            JSON.stringify([['GET /api/orders', { scenarioId: 'removed' }]])
        );

        await createElement();

        expect(getCookieValue(SCENARIO_COOKIE_NAME)).toBe('orders:success');
    });

    it('reset removes all panel storage and restores the defaults', async () => {
        localStorage.setItem(PROXY_ON_LOAD_STORAGE_KEY, 'false');
        localStorage.setItem(SAVE_SELECTIONS_STORAGE_KEY, 'true');
        localStorage.setItem(ENDPOINT_SELECTIONS_STORAGE_KEY, '[]');
        localStorage.setItem(POSITION_STORAGE_KEY, '{"x":20,"y":20}');
        const element = await createElement();
        const settings = await getSettings(element);

        settings.shadowRoot?.querySelector<HTMLButtonElement>('.reset')?.click();
        await element.updateComplete;

        expect(localStorage.getItem(PROXY_ON_LOAD_STORAGE_KEY)).toBeNull();
        expect(localStorage.getItem(SAVE_SELECTIONS_STORAGE_KEY)).toBeNull();
        expect(localStorage.getItem(ENDPOINT_SELECTIONS_STORAGE_KEY)).toBeNull();
        expect(localStorage.getItem(POSITION_STORAGE_KEY)).toBeNull();
        expect(getCookieValue(BYPASS_COOKIE_NAME)).toBe('');
        expect(getCookieValue(SCENARIO_COOKIE_NAME)).toBe('');
    });

    it('moves with Ctrl or Cmd and permanently stores the new position', async () => {
        localStorage.setItem(POSITION_STORAGE_KEY, JSON.stringify({ x: 28, y: 200 }));
        const element = await createElement();
        const launcher = element.shadowRoot?.querySelector<HTMLButtonElement>('.launcher');
        launcher!.setPointerCapture = vi.fn();

        launcher?.dispatchEvent(
            new PointerEvent('pointerdown', {
                bubbles: true,
                clientX: 40,
                clientY: 210,
                ctrlKey: true,
                pointerId: 1,
            })
        );
        launcher?.dispatchEvent(
            new PointerEvent('pointermove', {
                bubbles: true,
                clientX: 190,
                clientY: 130,
                pointerId: 1,
            })
        );
        launcher?.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 1 }));
        await element.updateComplete;

        expect(launcher?.getAttribute('style')).toBe('left: 178px;top: 120px');
        expect(localStorage.getItem(POSITION_STORAGE_KEY)).toBe('{"x":178,"y":120}');
    });
});
