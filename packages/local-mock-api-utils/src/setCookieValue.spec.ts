import { afterEach, describe, expect, it, vi } from 'vitest';

import { setCookieValue } from './setCookieValue';

describe('setCookieValue', () => {
    afterEach(() => vi.unstubAllGlobals());

    it('writes an encoded, site-safe cookie', () => {
        const cookieTarget = { cookie: '' };
        vi.stubGlobal('document', cookieTarget);

        setCookieValue('mock scenario', 'delay:long|error:500');

        expect(cookieTarget.cookie).toBe('mock%20scenario=delay%3Along%7Cerror%3A500; Path=/; SameSite=Lax');
    });
});
