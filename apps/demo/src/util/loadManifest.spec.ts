import { describe, expect, it, vi } from 'vitest';

import { loadManifest } from './loadManifest';

describe('loadManifest', () => {
    it('loads JSON from the fixed route', async () => {
        const manifest = { endpoints: [] };
        const request = vi.fn().mockResolvedValue({ ok: true, json: async () => manifest });
        await expect(loadManifest(request)).resolves.toEqual(manifest);
        expect(request).toHaveBeenCalledWith('/_local-mock-api/manifest');
    });

    it('reports unsuccessful requests', async () => {
        const request = vi.fn().mockResolvedValue({ ok: false, status: 503 });
        await expect(loadManifest(request)).rejects.toThrow('HTTP 503');
    });
});
