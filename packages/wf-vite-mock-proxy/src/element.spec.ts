// @vitest-environment happy-dom

import { BYPASS_COOKIE_NAME, getCookieValue, MANIFEST_ROUTE, SCENARIO_COOKIE_NAME } from '@wesflo/local-mock-api-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { WfSwitch } from '@wesflo/local-mock-api-ui';

import type { MockProxyEndpoints } from './component/Endpoints/element.js';
import './element.js';
import type { WfViteMockProxy } from './element.js';

const manifest = {
    endpoints: [
        {
            id: 'orders',
            method: 'GET',
            path: '/api/orders',
            scenarios: [
                { id: 'success', label: 'Erfolgreich' },
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
            vi.fn().mockResolvedValue(
                new Response(JSON.stringify(manifest), {
                    status: 200,
                    headers: { 'content-type': 'application/json' },
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

    it('moves with Ctrl or Cmd and permanently stores the new position', async () => {
        localStorage.setItem('wesflo-mock-api-button-position', JSON.stringify({ x: 28, y: 200 }));
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

        expect(launcher?.getAttribute('style')).toBe('left:178px;top:120px');
        expect(localStorage.getItem('wesflo-mock-api-button-position')).toBe('{"x":178,"y":120}');
    });
});
