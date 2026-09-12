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

    it('supports hyphens, underscores, numbers and letter casing in both ids', () => {
        expect([...parseScenarioCookie('Orders-V2:failure_500|user_details:Success2')]).toEqual([
            ['Orders-V2', 'failure_500'],
            ['user_details', 'Success2'],
        ]);
    });

    it('keeps the last value for duplicate endpoint entries', () => {
        expect([...parseScenarioCookie('orders:first|profile:default|orders:second')]).toEqual([
            ['orders', 'second'],
            ['profile', 'default'],
        ]);
    });

    it.each([undefined, '', '|||', ':'])('returns an empty map for %s', (value) => {
        expect(parseScenarioCookie(value)).toEqual(new Map());
    });

    it('ignores empty, whitespace, unicode, encoded and delimiter-containing ids', () => {
        expect([
            ...parseScenarioCookie(
                'valid:success|:empty-endpoint|empty-scenario:|with space:value|umlaut:grün|encoded%20id:value|a:b:c'
            ),
        ]).toEqual([['valid', 'success']]);
    });
});
