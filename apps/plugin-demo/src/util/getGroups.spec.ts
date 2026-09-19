import { describe, expect, it } from 'vitest';

import type { DemoCase } from '../interface';
import { getGroups } from './getGroups';

const testCase = { id: 'one', group: 'Success' } as DemoCase;

describe('getGroups', () => {
    it('returns unique groups in source order', () => {
        expect(
            getGroups([testCase, { ...testCase, id: 'two' }, { ...testCase, id: 'three', group: 'Errors' }])
        ).toEqual(['Success', 'Errors']);
        expect(getGroups([])).toEqual([]);
    });
});
