import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ logWarning: vi.fn() }));

vi.mock('./logWarning.js', () => ({ logWarning: mocks.logWarning }));

import { logManifestRouteWarnings } from './logManifestRouteWarnings.js';

describe('logManifestRouteWarnings', () => {
    beforeEach(() => vi.resetAllMocks());

    it('logs non-fatal endpoint warnings returned while reading the manifest', () => {
        logManifestRouteWarnings(true, 'mock.manifest.json', {
            status: 'valid',
            manifest: {},
            warnings: ['Ignoring invalid endpoint: mock.manifest.json.endpoints[1].status'],
        });

        expect(mocks.logWarning).toHaveBeenCalledWith(
            true,
            'Ignoring invalid endpoint: mock.manifest.json.endpoints[1].status'
        );
    });

    it('warns once when active configurations overlap on the same route', () => {
        logManifestRouteWarnings(true, 'mock.manifest.json', {
            status: 'valid',
            manifest: {
                endpoints: [
                    { id: 'generic', path: '/api/cart' },
                    { id: 'get', method: 'GET', path: '/api/cart/' },
                    { id: 'put', method: 'PUT', path: '/api/cart' },
                ],
            },
        });

        expect(mocks.logWarning).toHaveBeenCalledOnce();
        expect(mocks.logWarning).toHaveBeenCalledWith(
            true,
            expect.stringContaining(
                'route "/api/cart" has multiple matching configurations at endpoints[0], endpoints[1], endpoints[2]'
            )
        );
    });

    it('does not warn for disjoint methods, inactive endpoints, invalid manifests, or disabled logging', () => {
        const result = {
            status: 'valid' as const,
            manifest: {
                endpoints: [
                    { id: 'get', method: 'GET', path: '/api/cart' },
                    { id: 'put', method: 'PUT', path: '/api/cart' },
                    { id: 'inactive', method: 'GET', path: '/api/cart', active: false },
                ],
            },
        };

        logManifestRouteWarnings(true, 'mock.manifest.json', result);
        logManifestRouteWarnings(false, 'mock.manifest.json', result);
        logManifestRouteWarnings(true, 'mock.manifest.json', { status: 'missing' });

        expect(mocks.logWarning).not.toHaveBeenCalled();
    });
});
