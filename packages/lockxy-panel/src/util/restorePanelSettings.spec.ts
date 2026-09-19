import { describe, expect, it, vi } from 'vitest';

import { restorePanelSettings } from './restorePanelSettings.js';

describe('restorePanelSettings', () => {
    it('restores defaults and explicit values', () => {
        expect(restorePanelSettings({ getItem: () => null, setItem: vi.fn(), removeItem: vi.fn() })).toEqual({
            proxyOnLoad: true,
            saveSelections: false,
        });

        const values = new Map([
            ['lockxy-proxy-on-load', 'false'],
            ['lockxy-save-selections:checkout', 'true'],
        ]);
        expect(
            restorePanelSettings(
                {
                    getItem: (key) => values.get(key) ?? null,
                    setItem: vi.fn(),
                    removeItem: vi.fn(),
                },
                'checkout'
            )
        ).toEqual({ proxyOnLoad: false, saveSelections: true });
    });

    it('does not restore unscoped selections without a manifest ID', () => {
        const storage = {
            getItem: (key: string) => (key === 'lockxy-save-selections' ? 'true' : null),
            setItem: vi.fn(),
            removeItem: vi.fn(),
        };

        expect(restorePanelSettings(storage)).toEqual({ proxyOnLoad: true, saveSelections: false });
    });
});
