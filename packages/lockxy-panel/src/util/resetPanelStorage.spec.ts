import { describe, expect, it, vi } from 'vitest';

import { resetPanelStorage } from './resetPanelStorage.js';

describe('resetPanelStorage', () => {
    it('removes every panel-owned key', () => {
        const removeItem = vi.fn();
        const keys = [
            'unrelated',
            'lockxy-save-selections:checkout',
            'lockxy-endpoint-selections:checkout',
        ];
        resetPanelStorage({
            getItem: vi.fn(),
            setItem: vi.fn(),
            removeItem,
            length: keys.length,
            key: (index) => keys[index] ?? null,
        });
        expect(removeItem.mock.calls.map(([key]) => key)).toEqual([
            'lockxy-button-position',
            'lockxy-proxy-on-load',
            'lockxy-save-selections',
            'lockxy-endpoint-selections',
            'lockxy-save-selections:checkout',
            'lockxy-endpoint-selections:checkout',
        ]);
    });
});
