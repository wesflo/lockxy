// @vitest-environment happy-dom

import { describe, expect, it, vi } from 'vitest';

import './element.js';
import type { WfSwitch } from './element.js';

describe('wf-switch', () => {
    it('emits a non-bubbling onSwitchChange event', async () => {
        const element = document.createElement('wf-switch') as WfSwitch;
        const listener = vi.fn();
        element.addEventListener('onSwitchChange', listener);
        document.body.append(element);
        await element.updateComplete;

        const input = element.shadowRoot?.querySelector('input');
        input?.click();

        expect(listener).toHaveBeenCalledOnce();
        expect(listener.mock.calls[0]?.[0]).toMatchObject({
            bubbles: false,
            composed: false,
            detail: { checked: true },
        });
    });
});
