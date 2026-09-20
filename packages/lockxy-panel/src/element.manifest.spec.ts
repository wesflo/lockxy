// @vitest-environment happy-dom

import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { MockProxyEndpoints } from './component/Endpoints/element.js';
import './element.js';
import type { WfLockxyPanel } from './element.js';

const manifest = {
    id: 'manifest-retry',
    endpoints: [{ id: 'orders', method: 'GET', path: '/api/orders' }],
};

describe('wf-lockxy-panel manifest states', () => {
    beforeEach(() => {
        document.body.replaceChildren();
        localStorage.clear();
    });

    it('renders a failed request and replaces it with endpoints after retry', async () => {
        vi.stubGlobal(
            'fetch',
            vi
                .fn()
                .mockResolvedValueOnce(new Response(null, { status: 500 }))
                .mockResolvedValueOnce(new Response(JSON.stringify(manifest), { status: 200 }))
        );
        const element = document.createElement('wf-lockxy-panel') as WfLockxyPanel;
        document.body.append(element);

        await vi.waitFor(async () => {
            await element.updateComplete;
            const endpoints = element.shadowRoot?.querySelector<MockProxyEndpoints>('wf-lockxy-panel-endpoints');
            await endpoints?.updateComplete;
            expect(endpoints?.shadowRoot?.querySelector('[role="alert"]')?.textContent).toContain('HTTP 500');
        });

        const endpoints = element.shadowRoot?.querySelector<MockProxyEndpoints>('wf-lockxy-panel-endpoints');
        endpoints?.shadowRoot?.querySelector<HTMLButtonElement>('.retry')?.click();

        await vi.waitFor(async () => {
            await element.updateComplete;
            const retriedEndpoints = element.shadowRoot?.querySelector<MockProxyEndpoints>('wf-lockxy-panel-endpoints');
            await retriedEndpoints?.updateComplete;
            expect(retriedEndpoints?.shadowRoot?.querySelector('.endpoint')).not.toBeNull();
        });
        expect(fetch).toHaveBeenCalledTimes(2);
    });
});
