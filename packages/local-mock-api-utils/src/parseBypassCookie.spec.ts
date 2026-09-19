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

    it('supports every allowed separator and letter casing', () => {
        expect(parseBypassCookie('Orders-V2|user_details_3|ABC123')).toEqual({
            all: false,
            endpointIds: new Set(['Orders-V2', 'user_details_3', 'ABC123']),
        });
    });

    it.each([undefined, '', '|||'])('returns an empty selection for %s', (value) => {
        expect(parseBypassCookie(value)).toEqual({ all: false, endpointIds: new Set() });
    });

    it('ignores separators, whitespace, unicode and encoded ids', () => {
        expect(parseBypassCookie('valid|with space|colon:id|slash/id|ümlaut|encoded%20id|*')).toEqual({
            all: false,
            endpointIds: new Set(['valid']),
        });
    });
});
