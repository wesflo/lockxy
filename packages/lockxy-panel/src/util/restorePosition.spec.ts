import { describe, expect, it, vi } from 'vitest';

import { restorePosition } from './restorePosition.js';

const viewport = { width: 800, height: 600 };

describe('restorePosition', () => {
    it('restores and clamps a stored position', () => {
        expect(restorePosition({ getItem: () => '{"x":900,"y":120}', setItem: vi.fn() }, 'position', viewport)).toEqual(
            { x: 732, y: 120 }
        );
    });

    it.each([null, 'invalid', '{"x":"bad","y":20}'])('uses the default for invalid value %s', (value) => {
        expect(restorePosition({ getItem: () => value, setItem: vi.fn() }, 'position', viewport)).toEqual({
            x: 28,
            y: 272,
        });
    });

    it('uses the default when storage access throws', () => {
        expect(
            restorePosition(
                {
                    getItem: () => {
                        throw new Error('blocked');
                    },
                    setItem: vi.fn(),
                },
                'position',
                viewport
            )
        ).toEqual({ x: 28, y: 272 });
    });
});
