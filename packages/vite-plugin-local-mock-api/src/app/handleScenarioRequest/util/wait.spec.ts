import { afterEach, describe, expect, it, vi } from 'vitest';

import { wait } from './wait.js';

describe('wait', () => {
    afterEach(() => vi.useRealTimers());

    it('resolves after the requested delay', async () => {
        vi.useFakeTimers();
        let resolved = false;
        const pending = wait(250).then(() => {
            resolved = true;
        });

        await vi.advanceTimersByTimeAsync(249);
        expect(resolved).toBe(false);

        await vi.advanceTimersByTimeAsync(1);
        await pending;
        expect(resolved).toBe(true);
    });
});
