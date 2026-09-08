import { afterEach, describe, expect, it, vi } from 'vitest';

import { downloadBlob } from './downloadBlob';

describe('downloadBlob', () => {
    afterEach(() => vi.unstubAllGlobals());

    it('downloads a blob and releases its object URL', () => {
        const click = vi.fn();
        const anchor = { href: '', download: '', click };
        const createObjectURL = vi.fn(() => 'blob:preview');
        const revokeObjectURL = vi.fn();
        vi.stubGlobal('document', { createElement: vi.fn(() => anchor) });
        vi.stubGlobal('URL', { createObjectURL, revokeObjectURL });
        const blob = new Blob(['demo']);

        downloadBlob(blob, 'demo.pdf');

        expect(anchor).toMatchObject({
            href: 'blob:preview',
            download: 'demo.pdf',
        });
        expect(click).toHaveBeenCalledOnce();
        expect(revokeObjectURL).toHaveBeenCalledWith('blob:preview');
    });
});
