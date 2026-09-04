// @vitest-environment happy-dom

import { describe, expect, it, vi } from 'vitest';
import { html, render } from 'lit';

import './button';
import type { WfButton } from './button';

describe('wf-button', () => {
    it('emits onClick for an enabled button', async () => {
        const element = document.createElement('wf-button') as WfButton;
        const listener = vi.fn();
        element.addEventListener('onClick', listener);
        document.body.append(element);
        await element.updateComplete;

        element.shadowRoot?.querySelector('button')?.click();

        expect(listener).toHaveBeenCalledOnce();
    });

    it('does not emit onClick when disabled', async () => {
        const element = document.createElement('wf-button') as WfButton;
        const listener = vi.fn();
        element.disabled = true;
        element.addEventListener('onClick', listener);
        document.body.append(element);
        await element.updateComplete;

        element.shadowRoot?.querySelector('button')?.dispatchEvent(new MouseEvent('click'));

        expect(listener).not.toHaveBeenCalled();
    });

    it('supports the @onClick Lit consumer API', async () => {
        const listener = vi.fn();
        const container = document.createElement('div');
        document.body.append(container);
        render(html`<wf-button @onClick=${listener}>Run</wf-button>`, container);
        const element = container.querySelector('wf-button') as WfButton;
        await element.updateComplete;

        element.shadowRoot?.querySelector('button')?.click();

        expect(listener).toHaveBeenCalledOnce();
    });
});
