import { describe, expect, it } from 'vitest';

import { formatResultBody } from './formatResultBody';

describe('formatResultBody', () => {
    it('formats structured response data for the result panel', () => {
        expect(formatResultBody({ source: 'explicit', ok: true })).toBe(
            '{\n  "source": "explicit",\n  "ok": true\n}'
        );
    });

    it('keeps plain-text responses unchanged', () => {
        expect(formatResultBody('plain response')).toBe('plain response');
    });

    it('represents an empty response without placeholder content', () => {
        expect(formatResultBody(null)).toBe('');
    });

    it('shows the message from a request error', () => {
        expect(formatResultBody(new Error('request failed'))).toBe('request failed');
    });
});
