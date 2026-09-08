import { describe, expect, it, vi } from 'vitest';

import { copyText } from './copyText.js';

describe('copyText', () => {
    it('writes the supplied value to the clipboard', async () => {
        const writeText = vi.fn().mockResolvedValue(undefined);

        await copyText('mock response', { writeText });

        expect(writeText).toHaveBeenCalledWith('mock response');
    });

    it('does nothing when the Clipboard API is unavailable', async () => {
        await expect(copyText('mock response', undefined)).resolves.toBeUndefined();
    });
});
