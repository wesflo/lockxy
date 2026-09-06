import { describe, expect, it, vi } from 'vitest';

import { clampPosition } from './clampPosition.js';
import { defaultPosition } from './defaultPosition.js';
import { persistPosition } from './persistPosition.js';
import { restorePosition } from './restorePosition.js';

const viewport = { width: 800, height: 600 };

describe('launcher position utilities', () => {
    it('clamps a position to the visible viewport', () => {
        expect(clampPosition({ x: -10, y: 900 }, viewport)).toEqual({ x: 12, y: 532 });
    });

    it('returns a centered default position', () => {
        expect(defaultPosition(viewport)).toEqual({ x: 28, y: 272 });
    });

    it('restores a valid position and falls back for invalid data', () => {
        expect(restorePosition({ getItem: () => '{"x":100,"y":120}', setItem: vi.fn() }, 'position', viewport)).toEqual({ x: 100, y: 120 });
        expect(restorePosition({ getItem: () => 'invalid', setItem: vi.fn() }, 'position', viewport)).toEqual({ x: 28, y: 272 });
    });

    it('persists a serialized position', () => {
        const storage = { getItem: vi.fn(), setItem: vi.fn() };
        persistPosition(storage, 'position', { x: 100, y: 120 });
        expect(storage.setItem).toHaveBeenCalledWith('position', '{"x":100,"y":120}');
    });
});
