import { describe, expect, it, vi } from 'vitest';

import { restorePanelSettings } from './restorePanelSettings.js';

describe('restorePanelSettings', () => {
    it('restores defaults and explicit values', () => {
        expect(restorePanelSettings({ getItem: () => null, setItem: vi.fn(), removeItem: vi.fn() })).toEqual({
            proxyOnLoad: true,
            saveSelections: false,
        });

        const values = new Map([
            ['wesflo-mock-api-proxy-on-load', 'false'],
            ['wesflo-mock-api-save-selections', 'true'],
        ]);
        expect(
            restorePanelSettings({
                getItem: (key) => values.get(key) ?? null,
                setItem: vi.fn(),
                removeItem: vi.fn(),
            })
        ).toEqual({ proxyOnLoad: false, saveSelections: true });
    });
});
