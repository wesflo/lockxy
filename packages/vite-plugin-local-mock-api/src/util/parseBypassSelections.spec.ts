import { describe, expect, it } from 'vitest';

import { parseBypassSelections } from './parseBypassSelections.js';

describe('parseBypassSelections', () => {
    it('returns an empty selection without the bypass cookie', () => {
        expect(parseBypassSelections('theme=dark')).toEqual({
            all: false,
            endpointIds: new Set()
        });
    });

    it('recognizes the encoded global bypass value', () => {
        expect(parseBypassSelections('theme=dark; wesflo-mock-api-bypass=%2A')).toEqual({
            all: true,
            endpointIds: new Set()
        });
    });

    it('parses valid endpoint ids and ignores malformed values', () => {
        expect(
            parseBypassSelections(
                'wesflo-mock-api-bypass=orders%7Cuser_details%7Cbad%3Aid%7Corders'
            )
        ).toEqual({
            all: false,
            endpointIds: new Set(['orders', 'user_details'])
        });
    });

    it('ignores a malformed encoded value', () => {
        expect(parseBypassSelections('wesflo-mock-api-bypass=%E0%A4%A')).toEqual({
            all: false,
            endpointIds: new Set()
        });
    });
});
