import { describe, expect, it } from 'vitest';

import { formatJsonError } from './formatJsonError.js';

describe('formatJsonError', () => {
    it('adds an exact line and column for errors containing a character position', () => {
        const error = formatJsonError(
            'mock.manifest.json',
            '{\n  "delay": 20,\n}',
            new SyntaxError('Unexpected token at position 18')
        );

        expect(error).toBeInstanceOf(SyntaxError);
        expect(error.message).toBe(
            'mock.manifest.json:3:2: Invalid JSON: Unexpected token at position 18'
        );
    });

    it('keeps a useful filename when the parser provides no character position', () => {
        const error = formatJsonError('custom.json', '{}', new SyntaxError('Unexpected end of JSON input'));

        expect(error.message).toBe('custom.json: Invalid JSON: Unexpected end of JSON input');
    });

    it('normalizes thrown non-Error values', () => {
        expect(formatJsonError('mock.json', '', 'broken').message).toBe(
            'mock.json: Invalid JSON: broken'
        );
    });
});
