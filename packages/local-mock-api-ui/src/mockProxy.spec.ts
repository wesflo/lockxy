// @vitest-environment happy-dom

import { BYPASS_COOKIE_NAME, getCookieValue, MANIFEST_ROUTE, SCENARIO_COOKIE_NAME } from '@wesflo/local-mock-api-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import './mockProxy';
import type { WesfloMockProxy } from './mockProxy';

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

const createElement = async (): Promise<WesfloMockProxy> => {
    const element = document.createElement('wesflo-mock-proxy') as WesfloMockProxy;
    document.body.append(element);
    await vi.waitFor(() => expect(element.shadowRoot?.querySelector('.endpoint')).not.toBeNull());
    return element;
};

describe('wesflo-mock-proxy', () => {
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
        const master = element.shadowRoot?.querySelector<HTMLInputElement>('.master-toggle input');
        const endpointToggle = element.shadowRoot?.querySelector<HTMLInputElement>('.endpoint .switch input');
        const scenario = element.shadowRoot?.querySelector<HTMLSelectElement>('.endpoint select');

        master?.click();
        expect(getCookieValue(BYPASS_COOKIE_NAME)).toBe('*');

        master?.click();
        endpointToggle?.click();
        expect(getCookieValue(BYPASS_COOKIE_NAME)).toBe('orders');

        scenario!.value = 'error';
        scenario?.dispatchEvent(new Event('change'));
        expect(getCookieValue(SCENARIO_COOKIE_NAME)).toBe('orders:error');
    });

    it('restores the permanently stored launcher position', async () => {
        localStorage.setItem('wesflo-mock-api-button-position', JSON.stringify({ x: 144, y: 96 }));

        const element = await createElement();

        expect(element.shadowRoot?.querySelector<HTMLButtonElement>('.launcher')?.getAttribute('style')).toBe(
            'left:144px;top:96px'
        );
    });

    it('moves only with Ctrl or Cmd and permanently stores the new position', async () => {
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
                ctrlKey: true,
                pointerId: 1,
            })
        );
        launcher?.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 1 }));
        await element.updateComplete;

        expect(launcher?.getAttribute('style')).toBe('left:178px;top:120px');
        expect(localStorage.getItem('wesflo-mock-api-button-position')).toBe('{"x":178,"y":120}');
    });
});
