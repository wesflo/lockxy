import { describe, expect, it } from 'vitest';

import { toMethodArray } from './toMethodArray.js';

describe('toMethodArray', () => {
    it('normalizes omitted, single and multiple methods', () => {
        expect(toMethodArray(undefined)).toEqual([]);
        expect(toMethodArray('POST')).toEqual(['POST']);
        expect(toMethodArray(['POST', 'PUT'])).toEqual(['POST', 'PUT']);
    });
});
