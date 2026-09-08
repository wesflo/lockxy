// @vitest-environment happy-dom

import { describe, expect, it } from 'vitest';

import './element.js';
import type { WfIcon } from './element.js';

describe('wf-icon', () => {
    it('renders the default icon as a decorative medium SVG', async () => {
        const element = document.createElement('wf-icon') as WfIcon;
        document.body.append(element);
        await element.updateComplete;

        const svg = element.shadowRoot?.querySelector('svg');
        expect(svg?.getAttribute('aria-hidden')).toBe('true');
        expect(svg?.getAttribute('width')).toBe('20');
        expect(svg?.getAttribute('height')).toBe('20');
        expect(svg?.querySelector('path')?.getAttribute('d')).toContain('m13 2');
    });

    it('updates the icon path and dimensions', async () => {
        const element = document.createElement('wf-icon') as WfIcon;
        element.name = 'close';
        element.size = 'xl';
        document.body.append(element);
        await element.updateComplete;

        const svg = element.shadowRoot?.querySelector('svg');
        expect(svg?.getAttribute('width')).toBe('32');
        expect(svg?.getAttribute('height')).toBe('32');
        expect(svg?.querySelector('path')?.getAttribute('d')).toBe('m6 6 12 12M18 6 6 18');
    });
});
