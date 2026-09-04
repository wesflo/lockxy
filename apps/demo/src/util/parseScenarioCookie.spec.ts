import { describe, expect, it } from 'vitest';

import { parseScenarioCookie } from './parseScenarioCookie';

describe('parseScenarioCookie', () => {
    it('returns no selections for an empty cookie value', () => {
        expect([...parseScenarioCookie().entries()]).toEqual([]);
    });

    it('returns every valid endpoint and scenario pair', () => {
        expect([...parseScenarioCookie('delay:short|http-errors:server-error').entries()]).toEqual([
            ['delay', 'short'],
            ['http-errors', 'server-error']
        ]);
    });

    it('ignores malformed entries without losing valid selections', () => {
        expect([...parseScenarioCookie('invalid|delay:long|:missing|too:many:parts').entries()]).toEqual([
            ['delay', 'long']
        ]);
    });
});
