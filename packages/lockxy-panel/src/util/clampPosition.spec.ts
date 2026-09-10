import { describe, expect, it } from 'vitest';

import { clampPosition } from './clampPosition.js';

describe('clampPosition', () => {
    it('keeps the launcher inside every viewport edge', () => {
        expect(clampPosition({ x: -10, y: 900 }, { width: 800, height: 600 })).toEqual({ x: 0, y: 560 });
        expect(clampPosition({ x: 100, y: 120 }, { width: 800, height: 600 })).toEqual({ x: 100, y: 120 });
    });
});
