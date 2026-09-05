// @vitest-environment happy-dom

import type { WfSwitch } from '@wesflo/local-mock-api-ui';
import { describe, expect, it, vi } from 'vitest';

import './element.js';
import type { MockProxyEndpoints } from './element.js';

const createElement = async (): Promise<MockProxyEndpoints> => {
    const element = document.createElement('wf-vite-mock-proxy-endpoints') as MockProxyEndpoints;
    element.loading = false;
    document.body.append(element);
    return element;
};

describe('mock proxy endpoints', () => {
    it('renders a single scenario as text', async () => {
        const element = await createElement();
        element.endpoints = [
            { id: 'orders', method: 'GET', path: '/api/orders', scenarios: [{ id: 'success', label: 'Success' }] }
        ];
        await element.updateComplete;

        expect(element.shadowRoot?.querySelector('.scenario-value')?.textContent).toBe('Success');
        expect(element.shadowRoot?.querySelector('select')).toBeNull();
    });

    it('emits endpoint changes without crossing its shadow boundary', async () => {
        const element = await createElement();
        const listener = vi.fn();
        element.endpoints = [{ id: 'orders', method: 'GET', path: '/api/orders' }];
        element.addEventListener('onEndpointChange', listener);
        await element.updateComplete;

        const endpointSwitch = element.shadowRoot?.querySelectorAll<WfSwitch>('wf-switch')[1];
        endpointSwitch?.shadowRoot?.querySelector<HTMLInputElement>('input')?.click();

        expect(listener).toHaveBeenCalledOnce();
        expect(listener.mock.calls[0]?.[0]).toMatchObject({ bubbles: false, composed: false });
    });
});
