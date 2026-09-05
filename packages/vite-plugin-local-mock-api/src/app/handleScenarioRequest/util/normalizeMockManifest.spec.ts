import { describe, expect, it } from 'vitest';

import { normalizeMockManifest } from './normalizeMockManifest.js';

describe('normalizeMockManifest', () => {
    it('generates endpoint and scenario metadata from method, path and index', () => {
        expect(
            normalizeMockManifest({
                endpoints: [
                    {
                        method: 'GET',
                        path: '/api/users/:id',
                        scenarios: [{ status: 200 }, { id: 'failure', status: 500 }]
                    }
                ]
            })
        ).toEqual({
            endpoints: [
                {
                    id: 'get_api_users_id',
                    method: 'GET',
                    path: '/api/users/:id',
                    scenarios: [
                        { id: 'api_users_id_1', label: 'api_users_id_1', status: 200 },
                        { id: 'failure', label: 'failure', status: 500 }
                    ]
                }
            ]
        });
    });

    it('uses ANY when an endpoint method is omitted', () => {
        const manifest = normalizeMockManifest({ endpoints: [{ path: '/api/health' }] });

        expect(manifest.endpoints?.[0]?.id).toBe('any_api_health');
    });

    it('keeps a root-delay-only manifest minimal', () => {
        expect(normalizeMockManifest({ delay: 400 })).toEqual({ delay: 400 });
    });
});
