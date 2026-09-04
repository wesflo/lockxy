import { describe, expect, it } from 'vitest';

import { parseBypassCookie } from './parseBypassCookie';

describe('parseBypassCookie', () => {
    it('recognizes the global marker', () => {
        expect(parseBypassCookie('*')).toEqual({ all: true, endpointIds: new Set() });
    });

    it('parses unique valid endpoint ids', () => {
        expect(parseBypassCookie('orders|user_details|bad:id|orders')).toEqual({
            all: false,
            endpointIds: new Set(['orders', 'user_details']),
        });
    });
});
