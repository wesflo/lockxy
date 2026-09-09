// @vitest-environment happy-dom

import type { WfSwitch } from '@wesflo/local-mock-api-ui';
import { describe, expect, it, vi } from 'vitest';

import { ON_RESET_SETTINGS_EVENT, ON_SETTING_CHANGE_EVENT } from './constant.js';
import './element.js';
import type { MockProxySettings } from './element.js';

const createSettings = async (): Promise<MockProxySettings> => {
    const element = document.createElement('wf-lockxy-panel-settings') as MockProxySettings;
    document.body.append(element);
    await element.updateComplete;
    return element;
};

describe('wf-lockxy-panel-settings', () => {
    it('renders the documented defaults', async () => {
        const element = await createSettings();
        const switches = element.shadowRoot?.querySelectorAll<WfSwitch>('wf-switch');
        await Promise.all([...switches!].map((item) => item.updateComplete));

        expect(element.proxyOnLoad).toBe(true);
        expect(element.saveSelections).toBe(false);
        expect(switches?.[0].checked).toBe(true);
        expect(switches?.[1].checked).toBe(false);
        expect(element.shadowRoot?.textContent).toContain('Enable proxy on load');
        expect(element.shadowRoot?.textContent).toContain('Endpoint and scenario choices are preserved.');
    });

    it('identifies each changed setting in its event detail', async () => {
        const element = await createSettings();
        const listener = vi.fn();
        element.addEventListener(ON_SETTING_CHANGE_EVENT, listener);
        const switches = element.shadowRoot?.querySelectorAll<WfSwitch>('wf-switch');
        await Promise.all([...switches!].map((item) => item.updateComplete));

        switches?.[0].shadowRoot?.querySelector('input')?.click();
        switches?.[1].shadowRoot?.querySelector('input')?.click();

        expect(listener.mock.calls.map(([event]) => event.detail)).toEqual([
            { name: 'proxyOnLoad', checked: false },
            { name: 'saveSelections', checked: true },
        ]);
    });

    it('emits a reset event from the reset button', async () => {
        const element = await createSettings();
        const listener = vi.fn();
        element.addEventListener(ON_RESET_SETTINGS_EVENT, listener);

        element.shadowRoot?.querySelector<HTMLButtonElement>('.reset')?.click();

        expect(listener).toHaveBeenCalledOnce();
    });
});
