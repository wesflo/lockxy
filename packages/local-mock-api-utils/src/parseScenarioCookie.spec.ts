import { describe, expect, it } from 'vitest';

import { parseScenarioCookie } from './parseScenarioCookie';

describe('parseScenarioCookie', () => {
    it('returns all valid selections', () => {
        expect([...parseScenarioCookie('delay:short|errors:server-error')]).toEqual([
            ['delay', 'short'],
            ['errors', 'server-error'],
        ]);
    });

    it('ignores malformed selections', () => {
        expect([...parseScenarioCookie('invalid|delay:long|too:many:parts')]).toEqual([['delay', 'long']]);
    });
});
