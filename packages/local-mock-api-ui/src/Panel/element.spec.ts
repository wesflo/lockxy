// @vitest-environment happy-dom

import { describe, expect, it } from 'vitest';

import './element.js';
import type { WfPanel } from './element.js';

describe('wf-panel', () => {
    it('provides separate heading, action and body slots', async () => {
        const element = document.createElement('wf-panel') as WfPanel;
        element.innerHTML = `
            <h2 slot="heading">Response</h2>
            <button slot="actions">Reset</button>
            <p>Response body</p>
        `;
        document.body.append(element);
        await element.updateComplete;

        const slots = element.shadowRoot?.querySelectorAll<HTMLSlotElement>('slot');
        expect(slots?.[0].name).toBe('heading');
        expect(slots?.[0].assignedElements()[0]?.textContent).toBe('Response');
        expect(slots?.[1].name).toBe('actions');
        expect(slots?.[1].assignedElements()[0]?.textContent).toBe('Reset');
        expect(slots?.[2].name).toBe('');
        expect(slots?.[2].assignedElements()[0]?.textContent).toBe('Response body');
    });
});
