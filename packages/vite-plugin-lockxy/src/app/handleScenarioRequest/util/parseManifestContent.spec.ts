import { describe, expect, it } from 'vitest';

import { parseManifestContent } from './parseManifestContent.js';

describe('parseManifestContent', () => {
    it('parses JSON manifests', () => {
        expect(parseManifestContent('mock.manifest.json', '{"delay":400}')).toEqual({ delay: 400 });
    });

    it('keeps parsing explicitly configured legacy filenames as JSON', () => {
        expect(parseManifestContent('mock.config', '{"delay":400}')).toEqual({ delay: 400 });
    });

    it('preserves precise JSON syntax errors', () => {
        expect(() => parseManifestContent('mock.manifest.json', '{\n  "delay": 400,\n}')).toThrow(
            /mock\.manifest\.json:3:\d+: Invalid JSON/
        );
    });

    it.each(['yaml', 'yml'])('parses %s manifests', (extension) => {
        expect(parseManifestContent(`mock.manifest.${extension}`, 'delay: 400\nendpoints: []')).toEqual({
            delay: 400,
            endpoints: [],
        });
    });

    it('reports the YAML file and source location for syntax errors', () => {
        expect(() => parseManifestContent('mock.manifest.yaml', 'delay: [200, 600\n')).toThrow(
            /mock\.manifest\.yaml: Invalid YAML:.*line 2, column 1/si
        );
    });

    it('rejects duplicate YAML keys', () => {
        expect(() => parseManifestContent('mock.manifest.yaml', 'delay: 200\ndelay: 400')).toThrow(
            /Map keys must be unique/
        );
    });

    it('rejects custom YAML tags', () => {
        expect(() => parseManifestContent('mock.manifest.yaml', 'delay: !milliseconds 400')).toThrow(
            /Unresolved tag/
        );
    });

    it('limits YAML alias expansion', () => {
        const aliases = Array.from({ length: 101 }, () => '*delay').join(', ');

        expect(() => parseManifestContent('mock.manifest.yaml', `delay: &delay 200\nendpoints: [${aliases}]`)).toThrow(
            /Excessive alias count/
        );
    });
});
