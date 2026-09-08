// @vitest-environment happy-dom

import { describe, expect, it } from 'vitest';

import './element.js';
import type { WfBadge } from './element.js';

describe('wf-badge', () => {
    it('renders the neutral tone and slotted content by default', async () => {
        const element = document.createElement('wf-badge') as WfBadge;
        element.textContent = '200 OK';
        document.body.append(element);
        await element.updateComplete;

        expect(element.tone).toBe('neutral');
        expect(element.getAttribute('tone')).toBe('neutral');
        expect(element.shadowRoot?.querySelector('span')?.className).toBe('neutral');
        expect(element.textContent).toBe('200 OK');
    });

    it('reflects a changed tone into its host and rendered badge', async () => {
        const element = document.createElement('wf-badge') as WfBadge;
        element.tone = 'danger';
        document.body.append(element);
        await element.updateComplete;

        expect(element.getAttribute('tone')).toBe('danger');
        expect(element.shadowRoot?.querySelector('span')?.className).toBe('danger');
    });
});
