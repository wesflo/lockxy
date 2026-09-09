/** @vitest-environment happy-dom */

import { afterEach, describe, expect, it, vi } from 'vitest';

import { DEMO_TAG_NAME } from './constant';
import { MockApiDemo } from './index';

describe('MockApiDemo', () => {
    afterEach(() => {
        document.body.replaceChildren();
        vi.unstubAllGlobals();
    });

    it('renders the standalone plugin demo without registering the proxy panel', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue(
                new Response(JSON.stringify({ endpoints: [] }), {
                    headers: { 'content-type': 'application/json' },
                    status: 200,
                })
            )
        );

        const element = document.createElement(DEMO_TAG_NAME) as MockApiDemo;
        document.body.append(element);
        await element.updateComplete;

        expect(customElements.get(DEMO_TAG_NAME)).toBe(MockApiDemo);
        expect(customElements.get('wf-lockxy-panel')).toBeUndefined();
        expect(element.shadowRoot?.querySelector('h1')?.textContent).toContain('Build and test mock scenarios');
    });
});
