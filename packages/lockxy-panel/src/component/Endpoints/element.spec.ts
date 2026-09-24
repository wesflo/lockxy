// @vitest-environment happy-dom

import type { WfButton, WfSwitch } from '@wesflo/local-mock-api-ui';
import { describe, expect, it, vi } from 'vitest';

import { DOCUMENTATION_URL, MANIFEST_CONTROL_DOCUMENTATION_URL } from '../../constant.js';
import './element.js';
import type { MockProxyEndpoints } from './element.js';

const createElement = async (): Promise<MockProxyEndpoints> => {
    const element = document.createElement('wf-lockxy-panel-endpoints') as MockProxyEndpoints;
    element.loading = false;
    document.body.append(element);
    return element;
};

describe('mock proxy endpoints', () => {
    it('renders the endpoint label before a formatted ID instead of the path', async () => {
        const element = await createElement();
        element.endpoints = [
            { id: 'orders-list', label: 'Available orders', method: 'GET', path: '/api/internal/orders' },
            { id: 'customer_details', method: 'GET', path: '/api/internal/customers' },
        ];
        await element.updateComplete;

        const names = Array.from(element.shadowRoot?.querySelectorAll('.endpoint-name') ?? []).map((item) =>
            item.textContent?.trim()
        );

        expect(names).toEqual(['Available orders', 'Customer Details']);
    });

    it('renders a single scenario as text', async () => {
        const element = await createElement();
        element.endpoints = [
            { id: 'orders', method: 'GET', path: '/api/orders', scenarios: [{ id: 'success', label: 'Success' }] },
        ];
        await element.updateComplete;

        expect(element.shadowRoot?.querySelector('.scenario-value')?.textContent?.trim()).toBe('Success');
        expect(element.shadowRoot?.querySelector('select')).toBeNull();
    });

    it('identifies dynamic endpoints without rendering a scenario select', async () => {
        const element = await createElement();
        element.endpoints = [{ id: 'dynamic-foo', method: 'GET', path: '/api/foo/:id', dynamic: true }];
        await element.updateComplete;

        expect(element.shadowRoot?.querySelector('.scenario-value')?.textContent?.trim()).toBe('Dynamic response');
        expect(element.shadowRoot?.querySelector('select')).toBeNull();
    });

    it('renders an endpoint file or convention fallback when no scenario exists', async () => {
        const element = await createElement();
        element.endpoints = [
            { id: 'foo-bar', label: 'Endpoint label', method: 'GET', path: '/api/foo', file: 'endpoint.json' },
            { id: 'id-fallback', method: 'GET', path: '/api/id' },
        ];
        await element.updateComplete;

        const values = Array.from(element.shadowRoot?.querySelectorAll('.scenario-value') ?? []).map((item) =>
            item.textContent?.trim()
        );

        expect(values).toEqual(['endpoint.json', 'File by convention']);
        expect(element.shadowRoot?.querySelector('select')).toBeNull();
    });

    it('renders one scenario using its label, formatted ID, file or convention fallback', async () => {
        const element = await createElement();
        element.endpoints = [
            {
                id: 'label-fallback',
                method: 'GET',
                path: '/api/label',
                scenarios: [{ id: 'ignored-id', label: 'Scenario label', file: 'ignored.json' }],
            },
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
            {
                id: 'convention-fallback',
                method: 'GET',
                path: '/api/convention',
                scenarios: [{}],
            },
        ];
        await element.updateComplete;

        const values = Array.from(element.shadowRoot?.querySelectorAll('.scenario-value') ?? []).map((item) =>
            item.textContent?.trim()
        );

        expect(values).toEqual(['Scenario label', 'scenarios/explicit.json', 'Slow Response', 'File by convention']);
        expect(element.shadowRoot?.querySelector('select')).toBeNull();
    });

    it('selects the first scenario by default and renders file resolution last', async () => {
        const element = await createElement();
        element.endpoints = [
            {
                id: 'orders',
                method: 'GET',
                path: '/api/orders',
                scenarios: [
                    { id: 'success', label: 'Success' },
                    { id: 'error-response' },
                    { file: 'scenarios/file-only.json' },
                ],
            },
        ];
        await element.updateComplete;
        await Promise.resolve();

        const select = element.shadowRoot?.querySelector<HTMLSelectElement>('select');
        expect(select?.value).toBe('success');
        expect(Array.from(select?.options ?? []).map(({ textContent }) => textContent?.trim())).toEqual([
            'Success',
            'Error Response',
            'scenarios/file-only.json',
            'Default file resolution',
        ]);
        expect(select?.options[3]?.textContent?.trim()).toBe('Default file resolution');
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

    it('replaces all endpoint controls when the root manifest controls mocking', async () => {
        const element = await createElement();
        element.manifestControlled = true;
        element.endpoints = [{ id: 'orders', method: 'GET', path: '/api/orders' }];
        await element.updateComplete;

        const link = element.shadowRoot?.querySelector<HTMLAnchorElement>('.root-manifest-control a');
        expect(link?.textContent?.trim()).toBe('Controlled by manifest');
        expect(link?.href).toBe(MANIFEST_CONTROL_DOCUMENTATION_URL);
        expect(link?.target).toBe('_blank');
        expect(element.shadowRoot?.querySelector('.master-toggle')).toBeNull();
        expect(element.shadowRoot?.querySelector('.endpoint')).toBeNull();
    });

    it('replaces a manifest-controlled endpoint row with a documentation link', async () => {
        const element = await createElement();
        element.endpoints = [
            { id: 'profile', method: 'GET', path: '/api/profile', preventMock: true },
            {
                id: 'orders',
                method: 'GET',
                path: '/api/orders',
                scenarios: [{ id: 'success', active: false }, { id: 'failure' }],
            },
        ];
        await element.updateComplete;

        const endpoints = element.shadowRoot?.querySelectorAll('.endpoint');
        expect(endpoints).toHaveLength(2);
        endpoints?.forEach((endpoint) => {
            const link = endpoint.querySelector<HTMLAnchorElement>('.manifest-control');
            expect(endpoint.classList.contains('controlled')).toBe(true);
            expect(link?.href).toBe(MANIFEST_CONTROL_DOCUMENTATION_URL);
            expect(link?.target).toBe('_blank');
            expect(endpoint.querySelector('wf-switch')).toBeNull();
            expect(endpoint.querySelector('select')).toBeNull();
        });
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
