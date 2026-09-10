import { describe, expect, it } from 'vitest';

import { defaultPosition } from './defaultPosition.js';

describe('defaultPosition', () => {
    it('places the launcher at its default horizontal and centered vertical position', () => {
        expect(defaultPosition({ width: 800, height: 600 })).toEqual({ x: 28, y: 280 });
    });
});
