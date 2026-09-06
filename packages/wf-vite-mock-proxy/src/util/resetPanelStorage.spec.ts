import { describe, expect, it, vi } from 'vitest';

import { resetPanelStorage } from './resetPanelStorage.js';

describe('resetPanelStorage', () => {
    it('removes every panel-owned key', () => {
        const removeItem = vi.fn();
        resetPanelStorage({ getItem: vi.fn(), setItem: vi.fn(), removeItem });
        expect(removeItem.mock.calls.map(([key]) => key)).toEqual([
            'wesflo-mock-api-button-position',
            'wesflo-mock-api-proxy-on-load',
            'wesflo-mock-api-save-selections',
            'wesflo-mock-api-endpoint-selections'
        ]);
    });
});
