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

    it('reflects its checked state and accessible label into the native input', async () => {
        const element = document.createElement('wf-switch') as WfSwitch;
        element.checked = true;
        element.label = 'Proxy active';
        document.body.append(element);
        await element.updateComplete;

        const input = element.shadowRoot?.querySelector('input');
        expect(input?.checked).toBe(true);
        expect(input?.getAttribute('aria-label')).toBe('Proxy active');
    });

    it('does not change or emit while disabled', async () => {
        const element = document.createElement('wf-switch') as WfSwitch;
        const listener = vi.fn();
        element.disabled = true;
        element.addEventListener('onSwitchChange', listener);
        document.body.append(element);
        await element.updateComplete;

        const input = element.shadowRoot?.querySelector('input');
        input?.click();

        expect(input?.disabled).toBe(true);
        expect(element.checked).toBe(false);
        expect(listener).not.toHaveBeenCalled();
    });
});
