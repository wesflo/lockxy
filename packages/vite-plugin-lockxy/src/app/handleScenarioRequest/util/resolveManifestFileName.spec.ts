import { describe, expect, it } from 'vitest';

import { resolveManifestFileName } from './resolveManifestFileName.js';

describe('resolveManifestFileName', () => {
    it('prefers JSON over YAML for an extensionless configured name', () => {
        const fileIndex = new Set(['mock.manifest.yml', 'mock.manifest.yaml', 'mock.manifest.json']);

        expect(resolveManifestFileName('mock.manifest', fileIndex)).toBe('mock.manifest.json');
    });

    it('falls back from YAML to YML', () => {
        expect(resolveManifestFileName('mock.manifest', new Set(['mock.manifest.yml']))).toBe('mock.manifest.yml');
    });

    it('keeps an explicitly configured supported filename', () => {
        expect(resolveManifestFileName('custom.yaml', new Set(['custom.json']))).toBe('custom.yaml');
    });

    it('keeps an existing legacy filename with another extension', () => {
        expect(resolveManifestFileName('custom.config', new Set(['custom.config']))).toBe('custom.config');
    });

    it('returns the JSON candidate when no manifest exists', () => {
        expect(resolveManifestFileName('mock.manifest', new Set())).toBe('mock.manifest.json');
    });
});
