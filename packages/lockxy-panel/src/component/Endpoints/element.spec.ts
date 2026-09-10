// @vitest-environment happy-dom

import type { WfButton, WfSwitch } from '@wesflo/local-mock-api-ui';
import { describe, expect, it, vi } from 'vitest';

import { DOCUMENTATION_URL } from '../../constant.js';
import './element.js';
import type { MockProxyEndpoints } from './element.js';

const createElement = async (): Promise<MockProxyEndpoints> => {
    const element = document.createElement('wf-lockxy-panel-endpoints') as MockProxyEndpoints;
    element.loading = false;
    document.body.append(element);
    return element;
};

describe('mock proxy endpoints', () => {
    it('renders a single scenario as text', async () => {
        const element = await createElement();
        element.endpoints = [
            { id: 'orders', method: 'GET', path: '/api/orders', scenarios: [{ id: 'success', label: 'Success' }] },
        ];
        await element.updateComplete;

        expect(element.shadowRoot?.querySelector('.scenario-value')?.textContent?.trim()).toBe('Success');
        expect(element.shadowRoot?.querySelector('select')).toBeNull();
    });

    it('renders zero or one scenario using the label, formatted ID or file', async () => {
        const element = await createElement();
        element.endpoints = [
            { id: 'foo-bar', method: 'GET', path: '/api/foo' },
            {
                id: 'file-fallback',
                method: 'GET',
                path: '/api/file',
                scenarios: [{ file: 'scenarios/explicit.json' }],
            },
            {
                id: 'scenario-fallback',
                method: 'GET',
                path: '/api/scenario',
                scenarios: [{ id: 'slow-response' }],
            },
        ];
        await element.updateComplete;

        const values = Array.from(element.shadowRoot?.querySelectorAll('.scenario-value') ?? []).map((item) =>
            item.textContent?.trim()
        );

        expect(values).toEqual(['Foo Bar', 'scenarios/explicit.json', 'Slow Response']);
        expect(element.shadowRoot?.querySelector('select')).toBeNull();
    });

    it('offers reset and documentation actions in the footer', async () => {
        const element = await createElement();
        const listener = vi.fn();
        element.addEventListener('onResetSettings', listener);
        const reset = element.shadowRoot?.querySelector<WfButton>('.footer wf-button');
        await reset?.updateComplete;

        reset?.shadowRoot?.querySelector<HTMLButtonElement>('button')?.click();

        const documentation = element.shadowRoot?.querySelector<HTMLAnchorElement>('.footer a');
        expect(listener).toHaveBeenCalledOnce();
        expect(documentation?.href).toBe(DOCUMENTATION_URL);
        expect(documentation?.target).toBe('_blank');
    });

    it('renders and searches every method from a method array', async () => {
        const element = await createElement();
        element.endpoints = [{ id: 'write-profile', method: ['POST', 'PUT'], path: '/api/profile' }];
        element.query = 'put';
        await element.updateComplete;

        const methods = Array.from(element.shadowRoot?.querySelectorAll('.method') ?? []).map((item) =>
            item.textContent?.trim()
        );
        expect(methods).toEqual(['POST', 'PUT']);
        expect(element.shadowRoot?.querySelector('.endpoint')).not.toBeNull();
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
